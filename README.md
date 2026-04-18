# NoteRoot 🌳

[![Go Report Card](https://goreportcard.com/badge/github.com/RishiBuilds/NoteRoot)](https://goreportcard.com/report/github.com/RishiBuilds/NoteRoot)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Tree-based markdown documentation. No database. No container. One binary.**

NoteRoot is a self-hosted docs app for runbooks, internal wikis, and technical notes. Your content lives as plain Markdown files on disk - organized in a real folder tree, editable in any text editor, and deployable in minutes.

---

## Table of Contents

- [Why NoteRoot?](#why-noteroot)
- [Features](#features)
- [Quick Start](#quick-start)
- [Frontend Development](#frontend-development)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Deployment (Systemd Example)](#deployment-systemd-example)
- [Philosophy](#philosophy)
- [Contributing](#contributing)
- [License](#license)

---

## Why NoteRoot?

Most documentation tools are overbuilt. Confluence needs a team to maintain it. Wiki.js needs a database. DokuWiki needs PHP. You just want a place to keep your runbooks organized.

NoteRoot is the answer to one question: _what's the simplest thing that could actually work?_

- **Markdown files on disk** - no database, no lock-in.
- **Real tree structure** - not a flat list with tags.
- **Single Go binary** - copy it to a server, run it, done.
- **Git-friendly by default** - your docs folder is just a folder.

---

## Features

- **Tree-structured pages** reflecting your actual folder hierarchy.
- **On-the-fly rendering** ensures files stay portable and decoupled from the app.
- **Built-in UI** to create, move, rename, and delete pages seamlessly.
- **Slug-based routing** provides clean, shareable URLs.
- **JWT authentication** with admin and editor roles.
- **Per-page asset management** for images and file attachments.
- **Simple REST API** for scripting, integrations, and automation.
- **Zero ops overhead:** No Docker, no Postgres, no Redis required.

---

## Quick Start

Ensure you have [Go](https://golang.org/dl/) 1.23+ installed on your system.

### Option 1: Run from Source

```bash
# 1. Clone the repository
git clone https://github.com/RishiBuilds/NoteRoot.git
cd NoteRoot

# 2. Run directly in dev mode
go run ./cmd/noteroot/main.go
```

Then open `http://localhost:8080` in your browser. Default credentials: `admin` / `admin`.

### Option 2: Build a Single Binary

To build an optimized, standalone executable for your environment:

```bash
# Build the binary into the root directory
go build -o noteroot ./cmd/noteroot

# Run it, pointing it to your docs folder
./noteroot --docs ./my-docs --port 8080 --jwt-secret "your-secret-key"
```

---

## Frontend Development

The frontend is a React + Vite + TypeScript application located in `ui/noteroot-ui/`.

```bash
cd ui/noteroot-ui

# Install dependencies
npm install

# Start dev server (proxies API requests to Go backend on :8080)
npm run dev
```

> **Note:** The Go backend must be running on port 8080 for the frontend dev server to proxy API and asset requests correctly.

### Building for Production

```bash
cd ui/noteroot-ui
npm run build
```

The built output goes to `ui/noteroot-ui/dist/`. To embed the frontend in the Go binary, copy the build output to `internal/http/dist/` and set the `EmbedFrontend` build flag to `"true"`.

---

## Architecture

```
NoteRoot/
├── cmd/noteroot/         # Application entrypoint
├── internal/
│   ├── core/
│   │   ├── auth/         # User store (SQLite), auth service (JWT), user service
│   │   ├── assets/       # Per-page asset management (upload, list, delete)
│   │   ├── shared/       # Shared utilities and validation errors
│   │   └── tree/         # Page tree, slug service, filesystem page store
│   ├── http/
│   │   ├── api/          # REST API handlers (pages, users, assets, auth)
│   │   ├── middleware/   # Auth/admin middleware
│   │   ├── dist/         # Embedded frontend placeholder
│   │   └── router.go     # Gin router setup
│   └── noteroot/         # Core orchestration layer
├── ui/noteroot-ui/       # React + Vite frontend
├── docs/                 # Default docs storage directory
├── Dockerfile            # Production Docker image
└── Makefile              # Build & release automation
```

---

## Configuration

NoteRoot can be configured using command-line flags or environment variables.

| Flag               | Environment Variable     | Default   | Description                                    |
| ------------------ | ------------------------ | --------- | ---------------------------------------------- |
| `--docs`           | `NOTEROOT_DOCS`          | `./docs`  | Path to your Markdown directories.             |
| `--port`           | `NOTEROOT_PORT`          | `8080`    | Port for the HTTP server to listen on.         |
| `--host`           | `NOTEROOT_HOST`          | `0.0.0.0` | Host interface to bind to.                     |
| `--admin-password` | `NOTEROOT_ADMIN_PASSWORD`| `admin`   | Initial admin password (first run only).       |
| `--jwt-secret`     | `NOTEROOT_JWT_SECRET`    | _(empty)_ | Secret for signing auth tokens. **Required for secure auth.** |

---

## API Reference

NoteRoot ships with a REST API for automated workflows. All endpoints except auth require a `Bearer` token in the `Authorization` header.

### Authentication
- `POST /api/auth/login` — Login with `{ identifier, password }`. Returns JWT tokens.
- `POST /api/auth/refresh-token` — Refresh an expired token with `{ token }`.

### Pages
- `GET /api/tree` — Returns the full directory tree structure.
- `GET /api/pages/:id` — Returns page content and metadata by ID.
- `GET /api/pages/by-path?path=...` — Returns a page by its URL path.
- `GET /api/pages/slug-suggestion?title=...&parentID=...` — Suggests a unique slug.
- `POST /api/pages` — Create a new page with `{ title, slug, parentId? }`.
- `PUT /api/pages/:id` — Update a page with `{ title, slug, content }`.
- `DELETE /api/pages/:id?recursive=false` — Delete a page.
- `PUT /api/pages/:id/move` — Move a page to a new parent with `{ parentId }`.
- `PUT /api/pages/:id/sort` — Reorder children with `{ orderedIDs: [...] }`.

### Users (Admin only)
- `GET /api/users` — List all users.
- `POST /api/users` — Create a user with `{ username, email, password, role }`.
- `PUT /api/users/:id` — Update a user.
- `DELETE /api/users/:id` — Delete a user (cannot delete admin).
- `PUT /api/users/me/password` — Change own password with `{ old_password, new_password }`.

### Assets
- `POST /api/pages/:id/assets` — Upload a file (multipart form, field: `file`).
- `GET /api/pages/:id/assets` — List assets for a page.
- `DELETE /api/pages/:id/assets/:name` — Delete an asset.

---

## Deployment (Systemd Example)

Because NoteRoot is just a single binary, deploying it on a Linux server is trivial. Here is a basic `systemd` service configuration to keep it running continuously:

1. Move the binary into your PATH:

```bash
sudo mv noteroot /usr/local/bin/
```

2. Create a service file:

```bash
sudo nano /etc/systemd/system/noteroot.service
```

```ini
[Unit]
Description=NoteRoot Documentation Server
After=network.target

[Service]
User=www-data
Group=www-data
Restart=on-failure
ExecStart=/usr/local/bin/noteroot --docs /var/www/noteroot-docs --port 8080 --host 127.0.0.1 --jwt-secret "change-me-to-something-secure"

[Install]
WantedBy=multi-user.target
```

3. Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now noteroot
```

_(For production environments, you can optionally put NoteRoot behind a reverse proxy like Nginx or Caddy for SSL termination)._

---

## Philosophy

**Your data is just files.** You can `grep` it, back it up with `rsync`, version it with `git`, and read it without NoteRoot ever running. The app is a lightweight layer on top of the filesystem - not a replacement for it.

**Minimal ops is a feature.** If deploying your docs requires a database migration or a container orchestrator, something has gone wrong. NoteRoot should be runnable on any Linux box in under five minutes.

**Complexity is a cost.** Every dependency, every abstraction, every config option is a thing that can break. NoteRoot aims to be the kind of software you deploy once and forget about.

---

## Stay in the Loop

> More updates coming soon.  
> Watch the repo or drop a star ⭐ if you're curious!

---

## Contributing

We welcome issues, ideas, and pull requests! The project is in its early stages and the surface area is small - making it a fantastic time to get involved.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
