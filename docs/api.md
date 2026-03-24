# Droppp API Reference

This document describes the current HTTP API exposed by the app.
Canonical contract for paths/methods/status codes is in [`openapi.yaml`](./openapi.yaml).

## Base URL

- Local: `http://localhost:3000`
- Production: `https://droppp.ru`

## Authentication

- `Authorization: Bearer <token>` is required for:
  - `GET /api/shares/{code}/files/{fileIndex}`
  - `GET /api/shares/{code}/archive`
- `x-cleanup-secret: <CLEANUP_SECRET>` is required for:
  - `POST /api/cleanup`

## Limits and Validation

- Upload limits:
  - Max file size: `100 MB`
  - Max files per request: `10`
  - Allowed `ttlHours`: `1`, `6`, `12`, `24`
- PIN format: exactly 4 digits (`^\d{4}$`)
- Share code format: lowercase alphanumeric, 5 chars (`^[a-z0-9]{5}$`)
- Rate limits (best effort, in-memory):
  - Upload: `20` requests / `10` minutes
  - Share metadata: `120` requests / minute
  - PIN verify: `40` requests / `10` minutes
  - Download file: `120` requests / minute
  - Download archive: `30` requests / minute
- `429` responses include `retry-after` header (seconds).

## Token Lifecycle

- Access token is issued by `POST /api/shares/{code}` after successful PIN verification.
- Token is short-lived (currently 10 minutes).
- Rotating `SHARE_ACCESS_TOKEN_SECRET` invalidates already issued tokens immediately.
- Rotating `SHARE_ACCESS_TOKEN_SECRET` does **not** delete files from storage.

---

## `POST /api/upload`

Upload files and create a share.

### Request

- Content type: `multipart/form-data`
- Fields:
  - `pin` (string, required): 4 digits
  - `ttlHours` (string, optional): one of `1|6|12|24`
  - `files` (file[], required)

### Success `200`

```json
{
  "code": "abc12",
  "shortLink": "/s/abc12",
  "expiresAt": "2026-03-24T12:00:00.000Z"
}
```

### Errors

- `400` validation errors (`PIN must contain exactly 4 digits.`, `No files to upload.`, etc.)
- `429` too many upload requests
- `500` unexpected upload failure

### cURL (happy path)

```bash
curl -X POST "http://localhost:3000/api/upload" \
  -F "pin=1234" \
  -F "ttlHours=1" \
  -F "files=@/absolute/path/file1.pdf" \
  -F "files=@/absolute/path/file2.jpg"
```

### cURL (`400` invalid PIN)

```bash
curl -X POST "http://localhost:3000/api/upload" \
  -F "pin=12" \
  -F "files=@/absolute/path/file1.pdf"
```

### cURL (`429` example)

```bash
curl -i -X POST "http://localhost:3000/api/upload" \
  -F "pin=1234" \
  -F "files=@/absolute/path/file1.pdf"
```

---

## `GET /api/shares/{code}`

Fetch public metadata about a share.

### Success `200`

```json
{
  "code": "abc12",
  "createdAt": "2026-03-24T11:00:00.000Z",
  "expiresAt": "2026-03-24T12:00:00.000Z",
  "filesCount": 2
}
```

### Errors

- `404` share not found
- `410` share expired
- `429` too many requests

### cURL (happy path)

```bash
curl "http://localhost:3000/api/shares/abc12"
```

### cURL (`429` example)

```bash
curl -i "http://localhost:3000/api/shares/abc12"
```

---

## `POST /api/shares/{code}`

Verify PIN and get access token plus file list.

### Request

- Content type: `application/json`
- Body:

```json
{
  "pin": "1234"
}
```

### Success `200`

```json
{
  "token": "<short-lived-token>",
  "files": [
    {
      "index": 0,
      "name": "report.pdf",
      "mimeType": "application/pdf",
      "size": 12345
    }
  ]
}
```

### Errors

- `400` invalid body or PIN format
- `401` invalid PIN
- `404` share not found
- `410` share expired
- `429` too many attempts / temporary lock

### cURL (happy path)

```bash
curl -X POST "http://localhost:3000/api/shares/abc12" \
  -H "content-type: application/json" \
  -d '{"pin":"1234"}'
```

### cURL (`401` invalid PIN)

```bash
curl -i -X POST "http://localhost:3000/api/shares/abc12" \
  -H "content-type: application/json" \
  -d '{"pin":"9999"}'
```

---

## `GET /api/shares/{code}/files/{fileIndex}`

Download one file by index.

### Headers

- `Authorization: Bearer <token>` (required)

### Success `200`

- Binary file stream
- Response headers include:
  - `content-type`
  - `content-length`
  - `content-disposition`
  - `cache-control: no-store`

### Errors

- `400` invalid file index/path
- `401` access denied
- `404` share/file not found
- `410` share expired
- `429` too many download requests

### cURL (happy path)

```bash
curl "http://localhost:3000/api/shares/abc12/files/0" \
  -H "Authorization: Bearer <token>" \
  -o downloaded-file.bin
```

### cURL (`401` without token)

```bash
curl -i "http://localhost:3000/api/shares/abc12/files/0"
```

### cURL (`429` example)

```bash
curl -i "http://localhost:3000/api/shares/abc12/files/0" \
  -H "Authorization: Bearer <token>"
```

---

## `GET /api/shares/{code}/archive?files=0,1,2`

Download selected files as a ZIP archive.

### Headers

- `Authorization: Bearer <token>` (required)

### Query parameters

- `files` (required): comma-separated file indexes, e.g. `0,1,2`

### Success `200`

- ZIP binary stream
- Response headers include:
  - `content-type: application/zip`
  - `content-disposition`
  - `cache-control: no-store`

### Errors

- `400` no/invalid selected files
- `401` access denied
- `404` share not found
- `410` share expired
- `429` too many archive requests
- `500` archive creation failed

### cURL (happy path)

```bash
curl "http://localhost:3000/api/shares/abc12/archive?files=0,1" \
  -H "Authorization: Bearer <token>" \
  -o dropp-abc12.zip
```

### cURL (`401` without token)

```bash
curl -i "http://localhost:3000/api/shares/abc12/archive?files=0,1"
```

### cURL (`400` no files query)

```bash
curl -i "http://localhost:3000/api/shares/abc12/archive" \
  -H "Authorization: Bearer <token>"
```

### cURL (`429` example)

```bash
curl -i "http://localhost:3000/api/shares/abc12/archive?files=0,1" \
  -H "Authorization: Bearer <token>"
```

---

## `POST /api/cleanup`

Maintenance endpoint to force cleanup of expired shares/files.

### Headers

- `x-cleanup-secret: <CLEANUP_SECRET>` (required)

### Success `200`

```json
{
  "message": "Cleanup completed.",
  "removed": 2,
  "failed": 0
}
```

### Errors

- `401` unauthorized (missing or invalid secret)

### cURL (happy path)

```bash
curl -X POST "http://localhost:3000/api/cleanup" \
  -H "x-cleanup-secret: <CLEANUP_SECRET>"
```

### cURL (`401` without secret)

```bash
curl -i -X POST "http://localhost:3000/api/cleanup"
```

### `GET /api/cleanup`

- Not supported for execution.
- Returns `405 Method Not Allowed` with `allow: POST`.
