# task-manager-demo

Simple demo task manager: **Java Spring Boot** backend + **React (Vite + TypeScript)** frontend.

## Structure

```
.
├── backend/          Spring Boot 3.x REST API (port 8080)
│   ├── Dockerfile
│   └── src/...
├── frontend/         React + Vite UI
│   ├── netlify.toml
│   └── src/...
└── README.md
```

### Backend (`/backend`)

- In-memory CRUD for tasks (`id`, `title`, `completed`, `createdAt`)
- Endpoints under `/api/tasks`
- CORS open for local React (`localhost`) and Netlify (`*.netlify.app`)
- Optional Dockerfile for container runs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List tasks |
| GET | `/api/tasks/{id}` | Get one task |
| POST | `/api/tasks` | Create (`{ "title": "..." }`) |
| PUT | `/api/tasks/{id}` | Update title/completed |
| PATCH | `/api/tasks/{id}/toggle` | Toggle completed |
| DELETE | `/api/tasks/{id}` | Delete |

### Frontend (`/frontend`)

- List, add, toggle complete, and delete tasks
- Uses `VITE_API_URL` (default `http://localhost:8080`)
- Can be deployed to **Netlify** (see `frontend/netlify.toml`)

## Prerequisites

- JDK 17+ (21 recommended) and Maven 3.9+
- Node.js 20+ and npm

## Run backend locally

```bash
cd backend
mvn spring-boot:run
```

API: http://localhost:8080/api/tasks

Or with Docker:

```bash
cd backend
docker build -t task-manager-backend .
docker run --rm -p 8080:8080 task-manager-backend
```

## Run frontend locally

```bash
cd frontend
npm install
npm run dev
```

Optional env file:

```bash
cp .env.example .env
# edit VITE_API_URL if needed
```

Open the Vite URL (usually http://localhost:5173).

## Deploy frontend to Netlify

1. Connect this repo (or the `frontend/` folder) to Netlify.
2. Set build command `npm run build`, publish directory `dist` (already in `netlify.toml`).
3. Set environment variable `VITE_API_URL` to your publicly reachable backend URL.
4. Ensure the backend CORS allows your Netlify domain (already configured for `*.netlify.app`).

> Note: this demo keeps tasks in memory on the backend; they reset when the server restarts.

## License

Demo / sample project — use freely.
