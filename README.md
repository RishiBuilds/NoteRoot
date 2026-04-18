# NoteRoot 🌳

[![Go Report Card](https://goreportcard.com/badge/github.com/RishiBuilds/NoteRoot)](https://goreportcard.com/report/github.com/RishiBuilds/NoteRoot)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Tree-based markdown documentation. No database for content. Single binary deployment.**

NoteRoot is a high-performance, self-hosted documentation engine designed for developers, homelabs, and internal engineering teams. It treats the local filesystem as the absolute source of truth for your content while layering on an embedded SQLite database for authentication and user permission management, all delivered as a single compiled Go binary.

---

## Architecture & Tech Stack

NoteRoot is built on a decoupled client-server architecture, bound together during the final build process.

### Backend (Go / Gin)
- **Language**: Go 1.23
- **Routing**: `gin-gonic/gin` for high-throughput HTTP REST API routing.
- **Persistence**: `modernc.org/sqlite` (CGO-free embedded SQLite) strictly for user management and auth state. Content is strictly filesystem-bound.
- **Authentication**: `golang-jwt/jwt/v5` handling stateless JWT issuing and verification.
- **Utilities**: `gosimple/slug` for URL-safe path generation, `x/crypto/bcrypt` for secure credential hashing.

### Frontend (React / Vite)
- **Framework**: React 19 + TypeScript, bundled with Vite.
- **Routing & State**: `react-router-dom` for client-side routing, `zustand` for lightweight global state management.
- **UI & Styling**: **Neo-brutalist Design System** built via TailwindCSS, featuring bold contrast, flat colors, and `framer-motion` for micro-interactions. Accessible base primitives powered by Radix UI.
- **Markdown Rendering**: `react-markdown` ecosystem (`remark-gfm`, `rehype-highlight`) for GitHub-flavored markdown and syntax highlighting.

---

## Core Systems & Implementation Details

### Filesystem Page Store
NoteRoot intentionally avoids storing documentation content in a relational database. 
- The `PageStore` interface implemented in `internal/core/tree/` traverses a specified target directory (`--docs`).
- Directories represent structural nodes; `.md` files act as standard pages, while `index.md` acts as a directory's root content.
- Page rendering, structural tree generation, and path resolution happen dynamically. Slug collisions are mitigated via backend sequence checking.

### Authentication & Authorization Flow
- **Stateless API Layer**: Protected routes use Go middleware to validate `Bearer` JWT tokens embedded in the `Authorization` header.
- **User Segregation**: The system supports Admin and Editor roles. Read-only endpoints do not inherently require auth if public viewing is enabled, while mutations (POST/PUT/DELETE) enforce rigid JWT checks against the SQLite user table.

### Embedded SPA Mode
The typical deployment model compiles the React frontend into static assets (`dist/`), which are then embedded directly into the Go binary using the `embed` package. The Gin router serves static files natively, routing all unrecognized paths to `index.html` to allow `react-router` to take over client side routing.

---

## Building from Source

Ensure you have [Go 1.23+](https://golang.org/dl/) and Node.js installed.

### 1. Build the Frontend
```bash
cd ui/noteroot-ui
npm install
npm run build
```
Copy the contents of `ui/noteroot-ui/dist/` into `internal/http/dist/` if you are embedding the UI into the binary.

### 2. Build the Backend
```bash
# Return to the repo root
go build -o noteroot ./cmd/noteroot
```

---

## Development Environment

For local active development, run the backend and frontend separately:

**Start the Go API Server:**
```bash
go run ./cmd/noteroot/main.go --port 8080 --jwt-secret "dev-secret" --docs ./test-docs
```

**Start the Vite Dev Server:**
```bash
cd ui/noteroot-ui
npm run dev
```
The Vite dev server proxies all `/api` requests to `localhost:8080`, bypassing CORS issues and ensuring exact environment parity with production.

---

## Configuration Variables

NoteRoot can be configured using command-line flags or environment variables.

| Flag               | Environment Variable     | Default   | Description                                    |
| ------------------ | ------------------------ | --------- | ---------------------------------------------- |
| `--docs`           | `NOTEROOT_DOCS`          | `./docs`  | Target directory for Markdown storage.         |
| `--port`           | `NOTEROOT_PORT`          | `8080`    | HTTP listener port.                            |
| `--host`           | `NOTEROOT_HOST`          | `0.0.0.0` | Bind interface.                                |
| `--admin-password` | `NOTEROOT_ADMIN_PASSWORD`| `admin`   | Seed password for the initial admin user.      |
| `--jwt-secret`     | `NOTEROOT_JWT_SECRET`    | *runtime* | Cryptographic secret for signing auth tokens.  |

---

## API Reference (Internal)

REST architectural endpoints mapped in `router.go`:

### Auth & User (`/api/auth`, `/api/users`)
- `POST /api/auth/login` → Validates bcrypt hash, issues short-lived JWT.
- `GET /api/users` → Returns sanitized user structs (Admin only).

### Tree & Pages (`/api/tree`, `/api/pages`)
- `GET /api/tree` → Recursively generates JSON schema of the doc tree.
- `GET /api/pages/by-path` → Traverses filesystem to return specific MD payload.
- `POST /api/pages` → Injects new node into the virtual tree, writes literal `.md` file to disk.
- `PUT /api/pages/:id/move` → Triggers an OS-level file move/rename, re-indexes virtual tree.

### Assets (`/api/pages/:id/assets`)
- Handles `multipart/form-data` uploads, streaming bytes directly to the associated page directory alongside the `.md` file.

---

## Philosophy

NoteRoot was built with a strict adherence to operational simplicity:
1. **No External Dependencies**: Docker, Postgres, Redis, and reverse proxies are strictly optional.
2. **Text is King**: Standard tools (`git`, `grep`, `rsync`) remain the best ways to interact with text. NoteRoot layers on top of this abstraction, rather than hiding text in a DB BLOB field.

---

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
