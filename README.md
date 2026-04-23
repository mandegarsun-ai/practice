# OpoFinance Support Portal

A full-stack support dashboard for a forex brokerage — built with vanilla HTML/CSS/JS, Node.js/Express, and PostgreSQL.

## Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | HTML · CSS · Vanilla JS       |
| Backend  | Node.js · Express             |
| Database | PostgreSQL                    |
| Auth     | bcrypt password hashing       |

## Features

- Agent login / signup (stored in PostgreSQL `users` table)
- Tickets CRUD — create, view, edit, delete via REST API
- KYC queue, Withdrawals, Clients, Reports, Announcements pages
- Dark / light mode with localStorage persistence
- Web Audio API notification chimes
- Agent online / away / offline status toggle
- Live FX rates ticker (simulated)

## Project Structure

```
practice/
├── frontend/          # Static SPA (index.html, style.css, script.js)
├── backend/           # Express server
│   ├── server.js
│   ├── .env           # Not committed — copy from .env.example
│   └── .env.example
└── README.md
```

## Running Locally

### 1. Database setup

```sql
CREATE DATABASE opofinance;

\c opofinance

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'support',
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tickets (
  id          SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  issue_type  TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open',
  priority    TEXT NOT NULL DEFAULT 'medium',
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 2. Backend

```bash
cd backend
cp .env.example .env       # fill in your DB credentials
npm install
node server.js             # runs on http://localhost:3000
```

### 3. Frontend

Open `frontend/index.html` in your browser, or let the Express server serve it:

```
http://localhost:3000
```

## API Endpoints

| Method | Path                    | Description          |
|--------|-------------------------|----------------------|
| POST   | /api/auth/register      | Create account       |
| POST   | /api/auth/login         | Login                |
| GET    | /api/tickets            | List all tickets     |
| POST   | /api/tickets            | Create ticket        |
| PUT    | /api/tickets/:id        | Update ticket        |
| DELETE | /api/tickets/:id        | Delete ticket        |
