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

## Scripts

- `pnpm dev` — start development server
- `pnpm build` — production build
- `pnpm start` — run production server
- `pnpm lint` — lint project

## Storage

Current implementation stores files on local disk in `storage/` (excluded from git).
For production usage, prefer object storage (S3/R2/MinIO).

## Security

- See [SECURITY.md](./SECURITY.md)
- Terms and usage disclaimer are available in the app at `/legal`
