# NoteRoot 🌳

[![Go Report Card](https://goreportcard.com/badge/github.com/RishiBuilds/NoteRoot)](https://goreportcard.com/report/github.com/RishiBuilds/NoteRoot)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Tree-based markdown documentation. No database. No container. One binary.**

NoteRoot is a self-hosted docs app for runbooks, internal wikis, and technical notes. Your content lives as plain Markdown files on disk - organized in a real folder tree, editable in any text editor, and deployable in minutes.

---

## Table of Contents

- [Why NoteRoot?](#-why-noteroot)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Deployment (Systemd Example)](#-deployment-systemd-example)
- [Philosophy](#-philosophy)
- [Contributing](#-contributing)
- [License](#-license)

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
- **Simple REST API** for scripting, integrations, and automation.
- **Zero ops overhead:** No Docker, no Postgres, no Redis required.

---

## Quick Start

Ensure you have [Go](https://golang.org/dl/) 1.21+ installed on your system.

### Option 1: Run from Source

```bash
# 1. Clone the repository
git clone https://github.com/RishiBuilds/NoteRoot.git
cd NoteRoot

# 2. Run directly in dev mode
go run ./cmd/main.go
```

Then open `http://localhost:8080` in your browser and start writing.

### Option 2: Build a Single Binary

To build an optimized, standalone executable for your environment:

```bash
# Build the binary into the root directory
go build -o noteroot ./cmd

# Run it, pointing it to your docs folder
./noteroot --docs ./my-docs --port 8080
```

---

## Configuration

NoteRoot can be configured using command-line flags or environment variables.

| Flag     | Environment Variable | Default   | Description                            |
| -------- | -------------------- | --------- | -------------------------------------- |
| `--docs` | `NOTEROOT_DOCS`      | `./docs`  | Path to your Markdown directories.     |
| `--port` | `NOTEROOT_PORT`      | `8080`    | Port for the HTTP server to listen on. |
| `--host` | `NOTEROOT_HOST`      | `0.0.0.0` | Host interface to bind to.             |

---

## API Reference

NoteRoot ships with a minimal REST API for automated workflows. Enable your scripts to read, create, or modify documentation without manually editing files.

- `GET /api/tree` - Returns the full directory tree structure mapped to JSON.
- `GET /api/page?path=...` - Returns the raw markdown content for a specific path.
- `POST /api/page` - Create a new markdown file in the tree.
- `PUT /api/page` - Update an existing markdown file.
- `DELETE /api/page` - Remove a file entirely.

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
ExecStart=/usr/local/bin/noteroot --docs /var/www/noteroot-docs --port 8080 --host 127.0.0.1

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
> Watch the repo or drop a star ⭐ if you’re curious!

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
