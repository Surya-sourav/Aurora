# Aurora : A Robust swiss-knife App for Technical Blogging
<img width="200" height="200" alt="option-3-the-pure-typographic-angle-focus-on-sheer" src="https://github.com/user-attachments/assets/afe5d2ed-5d52-477b-a35f-c0d523de4b12" />

**A self-hostable portfolio and technical blog platform.**

Aurora ships an editor-first blog, a portfolio page, a career timeline, notes, bookmarks, and an admin dashboard — as a single Docker Compose stack. Deploy it to Render with one click, point it at a Postgres database, and start writing.

```
$ ls ~/
blog/  notes/  career/  bookmarks/  interests/  uses/  now/
```

---

## Features

**Content**
- Blog posts with markdown, syntax highlighting, callouts (`> [!note]`), KaTeX math, Mermaid diagrams, and wikilinks (`[[slug]]`)
- Categories to group posts (tech · finance · philosophy · …)
- Series for multi-part write-ups, with prev/next navigation baked into each post
- Short-form notes / TILs
- Bookmarks with commentary
- Career timeline with company logos
- Portfolio page with a photo gallery
- Editable `/uses` and `/now` pages

**Reader experience**
- Auto-generated table of contents, reading progress bar, view counts
- Related-post suggestions, social share buttons, Mastodon-based comments
- RSS feed, `sitemap.xml`, per-post Open Graph images
- Dark and light themes with system-preference detection
- Cmd+K command palette with fuzzy search across posts and notes
- Vim-style keyboard shortcuts (`g h`, `g b`, `t`, `?`)
- Terminal easter egg (press `` ` ``) with `ls`, `cd`, `cat`, `find`

**Writing**
- Split-view markdown editor with live preview
- Slash commands (`/code`, `/callout`, `/mermaid`, `/math`, …)
- Autosaved drafts, revision history (last 20 versions per post), scheduled publishing
- Drag-and-drop image upload
- Post templates: post-mortem, TIL, deep dive, learning note
- Optional AI-suggested tags via Claude

**Owner tools**
- Admin dashboard with per-post analytics
- Managers for categories, series, bookmarks, and notes

---

## Tech stack

| Layer | Choice |
|---|---|
| Backend | NestJS 11, TypeORM, Postgres |
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS v4 |
| Auth | JWT in httpOnly cookie, bcrypt |
| Deploy | Docker · Docker Compose · Render blueprint |

Postgres can be a free Neon instance, a managed database on Render/Fly, or a local `postgres:16` container — Aurora doesn't care.

---

## Quick start (Docker)

```bash
git clone https://github.com/YOUR_USER/aurora.git
cd aurora
cp .env.example .env          # fill in the values (see Configuration)
docker compose up --build
```

- Site: <http://localhost:3000>
- Admin login: <http://localhost:3000/admin/login>
- API: <http://localhost:8080> · Swagger at `/api/docs`

On first boot the backend seeds the admin user from `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`.

### Generate the admin password hash

Pick a strong password, then hash it:

```bash
docker run --rm node:20-alpine sh -c \
  "npm i -q bcrypt && node -e \"console.log(require('bcrypt').hashSync('YOUR_PASSWORD', 12))\""
```

Paste the `$2b$12$…` output into `.env` as `ADMIN_PASSWORD_HASH`. Keep the plaintext password in your password manager — Aurora never stores it.

---

## Deploy to Render

Aurora ships with a `render.yaml` blueprint.

1. Fork this repository.
2. In Render, choose **New → Blueprint** and select your fork.
3. Render provisions two services from the blueprint: `aurora-backend` and `aurora-frontend`.
4. Fill in the environment variables Render marks as required:
   - **Postgres**: `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` — from Neon, Render Postgres, or any Postgres provider
   - **Admin**: `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_NAME`
   - **Frontend**: `NEXT_PUBLIC_SITE_URL` — your frontend's public URL (e.g. `https://aurora-frontend.onrender.com`)
   - **Optional**: `ANTHROPIC_API_KEY` for AI tag suggestions
5. Deploy. First build takes ~4 minutes. The backend auto-creates its schema on boot.

The blueprint wires the frontend's `NEXT_PUBLIC_API_URL` to the backend's host and the backend's `FRONTEND_ORIGIN` back to the frontend — no manual URL wiring required.

### Other targets

The Dockerfiles have no Render-specific bits — any platform that runs a `Dockerfile` works:

- **Fly.io**: `fly launch` from the repo root for the backend, and again inside `web/` for the frontend.
- **Railway / DigitalOcean App Platform**: point at the repo, select the two Dockerfiles as separate services.
- **VPS**: `docker compose up -d` behind a reverse proxy (Caddy, Nginx, Traefik).

---

## Configuration

### Backend (`.env`)

| Variable | Required | Notes |
|---|---|---|
| `PGHOST` | ✓ | Postgres host |
| `PGPORT` |   | Defaults to `5432` |
| `PGUSER` | ✓ | Postgres user |
| `PGPASSWORD` | ✓ | Postgres password |
| `PGDATABASE` | ✓ | Postgres database name |
| `JWT_SECRET` | ✓ | 32+ random characters (`openssl rand -base64 48`) |
| `JWT_EXPIRES_IN` |   | Session length, defaults to `7d` |
| `ADMIN_EMAIL` | ✓ | Login email |
| `ADMIN_PASSWORD_HASH` | ✓ | Bcrypt hash of your password |
| `ADMIN_NAME` |   | Display name for the seeded portfolio row |
| `FRONTEND_ORIGIN` | ✓ in prod | CORS allow-list (comma-separated) |
| `ANTHROPIC_API_KEY` |   | Unlocks AI tag suggestions |
| `PORT` |   | Defaults to `8080` |
| `NODE_ENV` |   | Set to `production` to disable dev-only features |

### Frontend (`web/.env.local`)

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL. Read server-side only — safe to change without rebuilding. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used in Open Graph metadata and RSS. Baked at build time in Docker. |

---

## Architecture

```
┌────────────────────┐    HTTP + cookie    ┌──────────────────┐    SQL    ┌────────────┐
│  Next.js (web)     │ ──────────────────▶ │  NestJS (api)    │ ────────▶ │  Postgres  │
│  RSC · admin UI    │ ◀────────────────── │  auth · content  │ ◀──────── │            │
└────────────────────┘                     └──────────────────┘           └────────────┘
```

- The frontend proxies image, admin, and public API traffic through Next.js server routes (`/api/img`, `/api/admin/proxy`, `/api/public`), so the browser never talks to the backend directly.
- Auth is a JWT in an httpOnly cookie for the browser; the same token is accepted as a Bearer for CLI / API clients.
- Images live in Postgres as `bytea`, streamed with immutable cache headers. Fine for a personal-scale site; migrate to object storage if you outgrow it.
- `synchronize: true` runs in development to auto-create schema. Switch to TypeORM migrations before production.

---

## Development

Run the backend and frontend natively (no Docker) for hot-reload during development:

```bash
# Backend
npm install
cp .env.example .env
npm run start:dev              # http://localhost:8080

# Frontend (in another terminal)
cd web
npm install
cp .env.local.example .env.local
npm run dev                    # http://localhost:3000
```

The backend serves Swagger at `/api/docs`.

---

## Project layout

```
aurora/
├── src/                 NestJS backend
│   ├── auth/            JWT + bcrypt
│   ├── blog/            posts + revisions + scheduled publishing
│   ├── notes/           short-form
│   ├── bookmarks/
│   ├── career/          timeline + logos
│   ├── category/
│   ├── series/
│   ├── image/           bytea streaming
│   ├── personal/        portfolio + gallery
│   ├── ai/              Claude-powered tag suggestions
│   ├── analytics/
│   ├── feeds/           RSS + sitemap
│   └── database/entities/
├── web/                 Next.js frontend
│   ├── app/             App Router (public + admin + API proxies)
│   ├── components/
│   └── lib/
├── Dockerfile           backend image
├── web/Dockerfile       frontend image
├── docker-compose.yml   local one-command boot
└── render.yaml          Render blueprint
```

---

## License

MIT
