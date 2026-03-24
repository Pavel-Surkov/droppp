# Security Policy

## Supported Versions

This project is in active development. Security fixes are applied on the default branch.

## Reporting a Vulnerability

Please do not open a public issue for sensitive vulnerabilities.

Send a private report with:

- short description of the issue
- impact and possible exploit scenario
- reproduction steps (if available)
- affected endpoint or file

If you cannot share privately, open a minimal issue without exploit details and request a private contact channel.

## Scope Notes

- This project stores files temporarily and deletes expired shares.
- `POST /api/cleanup` is protected by `x-cleanup-secret` (`CLEANUP_SECRET` in env).
- Do not use this service for highly sensitive data without additional hardening and dedicated infrastructure.
