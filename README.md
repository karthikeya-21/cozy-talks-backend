# Cozy Talks Backend

NestJS backend for Cozy Talks, with JWT authentication, PostgreSQL via Prisma, realtime chat over Socket.IO, and image uploads served from the backend.

## Stack

- NestJS 11
- Prisma ORM
- PostgreSQL
- Socket.IO
- JWT auth
- Multer file uploads

## Features

- User registration and login
- Authenticated profile read and update flows
- Password update and account deletion
- User discovery and connection listing
- Chat request creation, approval, and rejection
- Direct messaging with conversation history
- Realtime message delivery and presence updates
- Image uploads exposed through `/uploads/...`

## Project Structure

```text
src/
  auth/            Authentication and profile management
  chat-requests/   Chat request workflows
  messages/        Message history and message creation
  prisma/          Prisma service wiring
  realtime/        Socket.IO gateway and event delivery
  uploads/         Upload endpoint
  users/           User discovery and connections
prisma/
  schema.prisma    Database schema
  seed.ts          Seed script
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

Notes:

- `DATABASE_URL` is used by the running application.
- `DIRECT_URL` is used for Prisma migrations and direct database operations.
- CORS is enabled for `FRONTEND_URL`.
- The API is served under the `/api` prefix.

## Getting Started

```bash
npm install
Copy .env.example to .env and update the database credentials
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

The server listens on `http://localhost:3001` by default, and uploaded files are served from `http://localhost:3001/uploads/...`.

## Available Scripts

```bash
npm run build
npm run start
npm run start:dev
npm run start:prod
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run prisma:seed
```

## API Overview

Base URL: `http://localhost:3001/api`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PATCH /auth/me`
- `PUT /auth/me/password`
- `DELETE /auth/me`

### Users

- `GET /users/discover?query=...`
- `GET /users/connections`

### Chat Requests

- `GET /chat-requests`
- `POST /chat-requests`
- `PATCH /chat-requests/:id`

### Messages

- `GET /messages/conversation?userId=...`
- `POST /messages`

### Uploads

- `POST /uploads/image`

## Realtime

Socket.IO runs on the `chat` namespace.

- Namespace: `/chat`
- Auth: pass the JWT in `auth.token`, or use `Authorization: Bearer <token>`
- Client event: `message:send`
- Server events:
  - `message:received`
  - `presence:update`

## Database

The Prisma schema currently models:

- `User`
- `ChatRequest`
- `Message`

Enums in use:

- `UserStatus`
- `ChatRequestStatus`
- `MessageType`

## Notes for Development

- Uploaded files are stored in the local `uploads/` directory.
- `dist/` is generated output and should not be committed.
- `node_modules/` and local `.env` files are ignored by Git.
- There is no automated test script configured in `package.json` yet.
