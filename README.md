# Dino Camp Roster

A full-stack roster app for **Dino Discovery Camp** — view and edit camper usernames. Built with React (frontend), Express (backend), and PostgreSQL.

## Tech stack

| Layer    | Stack |
| -------- | ----- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query |
| Backend  | Node.js, Express |
| Database | PostgreSQL |

## Project structure

```
├── frontend/     # React app (Vite, port 8080)
├── backend/      # Express API (port 3000)
└── db/           # Database scripts
    ├── schema.sql
    ├── seed.sql
    └── migrations/
        └── 001_add_username.sql
```

## Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** (e.g. 14+)
- **npm**

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd dino-camp-roster-frontend-only
```

### 2. Database

Create the database and run the schema and seed (use your Postgres user/password when prompted):

```bash
# Create database
psql -U postgres -d postgres -c "CREATE DATABASE dinocamp;"

# Create table and load seed data
psql -U postgres -d dinocamp -f db/schema.sql
psql -U postgres -d dinocamp -f db/seed.sql

# If the users table already existed before username was added, run:
psql -U postgres -d dinocamp -f db/migrations/001_add_username.sql
```

### 3. Backend environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set your Postgres password (and adjust host/port/user/database if needed):

```env
PORT=3000
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_actual_password
PGDATABASE=dinocamp
```

Install dependencies:

```bash
npm install
```

### 4. Frontend

```bash
cd ../frontend
npm install
```

## Running the app

You need **two terminals**: one for the API, one for the frontend. PostgreSQL must be running (e.g. start the Postgres app or service).

**Terminal 1 — backend**

```bash
cd backend
npm run dev
```

Backend runs at **http://localhost:3000**.

**Terminal 2 — frontend**

```bash
cd frontend
npm run dev
```

Frontend runs at **http://localhost:8080**. Open this URL in your browser; the app proxies `/api` to the backend.

## API

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| GET    | `/`                | API info                   |
| GET    | `/health`          | Health + DB connection     |
| GET    | `/api/users`       | List all users (roster)     |
| PATCH  | `/api/users/:id`   | Update a user’s username   |

**Update username example**

```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"username":"VelociAlex"}'
```

## Database scripts

- **`db/schema.sql`** — Creates the `users` table (`id`, `name`, `email`, `username`, `created_at`).
- **`db/seed.sql`** — Inserts four sample users.
- **`db/migrations/001_add_username.sql`** — Adds `username` and backfills it from `email` (for existing DBs created before `username` existed).

## License

Private / unlicensed unless you add one.
