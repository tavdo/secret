# Marketplace API (`backend/`)

Express + PostgreSQL + Prisma. Roles in code: **USER**, **PROVIDER**, **ADMIN**.

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` (DATABASE_URL + JWT secrets are required).

```bash
npx prisma generate
npx prisma db push
npm run dev
```

API base path: **`/v1`**. Socket.io attaches to the same HTTP server (`registerChatSockets`).

## Bootstrap admin

Public registration rejects `ADMIN`. Promote one user manually in SQL, e.g.:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'you@company.com';
```

## Security checklist (production)

- Strong `JWT_SECRET` / `JWT_REFRESH_SECRET`; short access TTL + refresh rotation (implemented).
- Tight **CORS** allowlist (`CORS_ORIGIN`).
- TLS termination and `trust proxy`.
- SMTP for verification/password emails; tune rate limits (`authLimiter` + global).
