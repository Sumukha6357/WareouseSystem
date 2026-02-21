# Warehouse Management System

A full-stack Warehouse Management System (WMS) monorepo for inventory operations, order fulfillment, shipment tracking, and operational analytics.

## Overview

- Frontend app: `web`
- Backend API: `api`
- Monorepo root: shared docs and repository metadata

## Tech Stack

### Frontend (`web`)

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Axios for API access
- STOMP/SockJS client support for real-time updates

### Backend (`api`)

- Spring Boot 3.4.6
- Java 17
- Spring Data JPA (Hibernate)
- PostgreSQL
- Spring Security with session/form login (`/login`, `/logout`)
- Spring WebSocket + STOMP broker

## Architecture (Text Diagram)

```text
Browser
  |
  | HTTP: http://localhost:3000
  v
Next.js Frontend (web)
  |- App Router pages/components
  |- Axios client baseURL = /api
  |- next.config.ts rewrites:
  |    /api/*    -> http://localhost:8080/*
  |    /login    -> http://localhost:8080/login
  |    /logout   -> http://localhost:8080/logout
  |    /ws/*     -> http://localhost:8080/ws/*
  v
Spring Boot API (api) :8080
  |- REST controllers
  |- Spring Security (form login/session + RBAC)
  |- Service layer
  |- JPA repositories
  |- WebSocket/STOMP endpoint: /ws
  v
PostgreSQL :5432
```

## Project Structure

- `/web` - Next.js frontend
- `/api` - Spring Boot backend
- `/README.md` - root project documentation

## Ports

- `3000`: Next.js dev server
- `8080`: Spring Boot API server
- `5432`: PostgreSQL database

## Environment Variables

Backend (`api`, from `application.yml` and compose):

- `DB_URL` (default: `jdbc:postgresql://localhost:5432/warehouse_db`)
- `DB_USERNAME` (default: `postgres`)
- `DB_PASSWORD` (default: `password`)

Frontend (`web`):

- No mandatory runtime env var for local proxy mode.
- Frontend calls `/api/*`, with proxy/rewrites defined in `web/next.config.ts`.

## Local Development

### Prerequisites

- Node.js 18+ (or newer)
- npm
- Java 17+
- PostgreSQL 15+ (or Docker)

### Option A: Run with local PostgreSQL

1. Start PostgreSQL and create database `warehouse_db`.
2. Set backend DB env vars.
3. Start backend:

```bash
cd api
./mvnw spring-boot:run
```

4. Start frontend in another terminal:

```bash
cd web
npm install
npm run dev
```

5. Open `http://localhost:3000`.

### Option B: Use Docker for backend + DB

```bash
cd api
docker compose up --build
```

Then run frontend locally:

```bash
cd web
npm install
npm run dev
```

## Build and Run

### Frontend

```bash
cd web
npm install
npm run build
npm run start
```

### Backend

```bash
cd api
./mvnw clean package
java -jar target/warehouse-api-0.0.1-SNAPSHOT.jar
```

## Testing

### Frontend checks

```bash
cd web
npm run lint
npm run build
```

### Backend checks

```bash
cd api
./mvnw test
```

Notes:
- Backend tests require valid DB connectivity for the configured datasource.
- If you only need compile verification:

```bash
cd api
./mvnw -DskipTests compile
```

## Authentication and Security Notes

- Authentication mode is session/form login (not JWT).
- Public registration endpoint: `/register`
- Login processing endpoint: `/login`
- Logout endpoint: `/logout`
- Role-based authorization is enforced through method-level security annotations.

## Real-Time Communication

- Backend enables WebSocket message broker with STOMP.
- SockJS endpoint: `/ws`
- Simple broker destination prefix: `/topic`

## CI Status and Explanation

- There is currently no CI pipeline configuration in this repository (no GitHub Actions workflow files detected).
- As a result, quality checks are currently expected to run locally (`npm run lint`, `npm run build`, `./mvnw test`).
- Recommended next step is to add CI to run frontend and backend checks on each PR.

## Authors

- Sumukha KY
