# Automate

Automate is a end to end [Zapier](https://zapier.com/) clone, it can orchestrate, schedule, and execute automated tasks and workflows. It features a modern web client, a robust backend API, and distributed worker services for scalable automation.

## Tech Stack
- **TypeScript** (client, backend, workers)
- **React** (client)
- **Express.js** (backend)
- **Prisma ORM** (backend)
- **Kafka** (event streaming & messaging)
- **PostgreSQL** (database)
- **Docker** & **Docker Compose** (containerization & orchestration)
- **Node.js** (runtime)

---

## Components

### `client`
A modern React-based web application for managing, scheduling, and monitoring automated jobs. Built with Vite, TailwindCSS, and Radix UI for a fast and responsive user experience.

### `backend`
A Node.js/Express API server that handles authentication, job management, and coordination between the client and distributed workers. Integrates with Kafka for messaging and PostgreSQL (via Prisma) for persistent storage.

### `workers`
A set of distributed worker services responsible for executing scheduled tasks. Includes:
- **schedular**: Schedules and dispatches jobs to the queue (Kafka).
- **ts-executor**: Executes jobs received from the queue.

---

## Running Locally

### Prerequisites
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- Node.js (v18+ recommended)
- pnpm or npm (for local dev)

### Quick Start (Recommended)

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd automate
   ```
2. **Copy and configure environment variables:**
   - Copy `.env.example` files in `backend`, `workers/schedular`, and `workers/ts-executor` to `.env` and update as needed.
3. **Start all services using Docker Compose:**
   ```sh
   docker compose -f scripts/app-docker-compose.yaml up --build
   ```
4. The client (web UI) and backend API will be available at their respective ports (see docker-compose file).

### Development (Individual Service)
- **Client:**
  ```sh
  cd client
  pnpm install # or npm install
  pnpm dev # or npm run dev
  ```
- **Backend:**
  ```sh
  cd backend
  pnpm install # or npm install
  pnpm dev # or npm run dev
  ```
- **Workers:**
  ```sh
  cd workers/<worker-name>
  pnpm install # or npm install
  pnpm dev # or npm run dev
  ```

---

## Contributing
Pull requests and issues are welcome! Please open an issue to discuss any major changes.

---

## License
[MIT](LICENSE)