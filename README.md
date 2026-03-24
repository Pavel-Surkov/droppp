# Droppp

Temporary file sharing service with short links and PIN protection.

## Features

- Upload files and get a short share link
- 4-digit PIN verification before access
- Download selected files or ZIP archive
- Automatic expiration and cleanup of stored shares
- RU/EN interface with language switcher

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS v4
- pnpm

## Local Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and set values:

```bash
cp .env.example .env.local
```

Required variable:

- `SHARE_ACCESS_TOKEN_SECRET` — random string, minimum 32 characters
- `CLEANUP_SECRET` — random string for protected `/api/cleanup` endpoint

### Cleanup Endpoint

`/api/cleanup` accepts `POST` only and requires header `x-cleanup-secret`.

Example:

```bash
curl -X POST \
  -H "x-cleanup-secret: $CLEANUP_SECRET" \
  http://localhost:3000/api/cleanup
```

## Scripts

- `pnpm dev` — start development server
- `pnpm build` — production build
- `pnpm start` — run production server
- `pnpm lint` — lint project

## Storage

Current implementation stores files on local disk in `storage/` (excluded from git).
For production usage, prefer object storage (S3/R2/MinIO).
On Vercel serverless, fallback storage path is `/tmp/dropp-storage` (ephemeral per instance).

## Security

- See [SECURITY.md](./SECURITY.md)
- Terms and usage disclaimer are available in the app at `/legal`
