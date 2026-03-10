# Yarli Verify System

Monorepo for the Yarli verification platform.

- `apps/api`: NestJS API + Prisma
- `apps/web`: React Router web client (built with Vite)
- `apps/scanner`: Expo mobile scanner app
- `packages/*`: shared workspace packages (`@repo/api`, lint/jest/ts configs, UI)

## Current stack and dependencies

- Node.js `>= 20.22`
- Yarn `4.12.0` (via Corepack)
- Turborepo `2.x`
- PostgreSQL `16`
- Docker + Docker Compose (for local deploy)

## Repository layout

```text
apps/
  api/
  web/
  scanner/
packages/
  api/
  eslint-config/
  jest-config/
  typescript-config/
  ui/
deploy/
  docker-compose.local.yml
  docker-compose.vm.yml
```

## 1) Install process (development)

### Step 1. Clone and enter project

```bash
git clone <your-repo-url>
cd yarli-verify-system
```

### Step 2. Enable Corepack and Yarn

```bash
corepack enable
corepack prepare yarn@4.12.0 --activate
yarn -v
```

### Step 3. Install workspace dependencies

```bash
yarn install --immutable
```

### Step 4. Configure environment files

#### API env (`apps/api/.env`)

Create/update `apps/api/.env`:

```env
DATABASE_URL=postgresql://yarli:yarli@localhost:5432/yarli_verify?schema=public

APP_PORT=3000

API_DOC_PATH=api/docs
API_DOC_VERSION=1.0.0
OPEN_API_VERSION=3.0.0

TELEGRAM_ENABLED=false
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Variable description:

- `DATABASE_URL`: PostgreSQL connection string used by Prisma and API runtime.
- `APP_PORT`: API listen port.
- `API_DOC_PATH`: Swagger route path.
- `API_DOC_VERSION`: Swagger doc version string.
- `OPEN_API_VERSION`: OpenAPI spec version in generated docs.
- `TELEGRAM_ENABLED`: Enables Telegram notifications when `true`.
- `TELEGRAM_BOT_TOKEN`: Telegram bot token (required if Telegram enabled).
- `TELEGRAM_CHAT_ID`: Target Telegram chat/channel ID.

#### Web env (`apps/web/.env`, optional for dev)

```env
VITE_API_BASE_URL=http://localhost:3000
```

Optional variables in your setup:

- `VITE_DEV_CERT`: local HTTPS cert path for dev server.
- `VITE_DEV_KEY`: local HTTPS key path for dev server.

### Step 5. Start PostgreSQL

Use Docker for local DB:

```bash
docker run --name yarli-postgres -e POSTGRES_USER=yarli -e POSTGRES_PASSWORD=yarli -e POSTGRES_DB=yarli_verify -p 5432:5432 -d postgres:16
```

### Step 6. Run DB migrations (and optional seed)

```bash
yarn workspace api db:migrate:deploy
# optional demo/test data
yarn workspace api db:seed
```

### Step 7. Start applications

Run all dev tasks:

```bash
yarn dev
```

Or run specific apps:

```bash
yarn workspace api dev
yarn workspace web dev
yarn workspace scanner android
```

### Useful workspace commands

```bash
yarn build
yarn test
yarn test:e2e
yarn lint
yarn format
```

## 2) Local deploy process with Docker (step by step)

Use `deploy/docker-compose.local.yml` for local machine deployment.

### Step 1. Create deploy env file

Create `deploy/.env`:

```env
POSTGRES_USER=yarli
POSTGRES_PASSWORD=yarli
POSTGRES_DB=yarli_verify

API_DOC_PATH=api/docs
API_DOC_VERSION=1.0.0
OPEN_API_VERSION=3.0.0

TELEGRAM_ENABLED=false
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

VITE_API_BASE_URL=http://localhost:3000
```

Variable description for `deploy/.env`:

- `POSTGRES_USER`: DB username for `postgres` container and API connection string.
- `POSTGRES_PASSWORD`: DB password.
- `POSTGRES_DB`: database name to create/use.
- `API_DOC_PATH`: Swagger path inside API.
- `API_DOC_VERSION`: Swagger docs version.
- `OPEN_API_VERSION`: OpenAPI spec version.
- `TELEGRAM_ENABLED`: enables Telegram integration in API.
- `TELEGRAM_BOT_TOKEN`: Telegram bot token.
- `TELEGRAM_CHAT_ID`: Telegram target chat.
- `VITE_API_BASE_URL`: injected at web image build time as `ARG`; should point to API public URL for browser clients.

### Step 2. Build and start infrastructure

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.local.yml up -d --build postgres
```

### Step 3. Apply migrations

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.local.yml --profile tools run --rm api-migrate
```

### Step 4. (Optional) Seed data

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.local.yml --profile tools run --rm api-seed
```

### Step 5. Start API and Web

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.local.yml up -d api web
```

### Step 6. Verify status and logs

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.local.yml ps
docker compose --env-file deploy/.env -f deploy/docker-compose.local.yml logs --tail=100 api
docker compose --env-file deploy/.env -f deploy/docker-compose.local.yml logs --tail=100 web
```

Expected ports:

- API: `http://localhost:3000`
- Web: `http://localhost` (port `80`)
- PostgreSQL: `localhost:5432`

Browser checks (local):

- Open web app: `http://localhost/`
- Open Swagger UI: `http://localhost:3000/${API_DOC_PATH}` (default: `http://localhost:3000/api/docs`)

If web opens but API calls fail in browser:

- verify API is up on `http://localhost:3000`
- verify `VITE_API_BASE_URL` in `deploy/.env` points to a browser-reachable API URL

### Step 7. Rebuild after code changes

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.local.yml up -d --build --force-recreate api web
```

### Step 8. Stop and cleanup

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.local.yml down
```

Remove volumes too (deletes database data):

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.local.yml down -v
```

## 3) VM deploy process (images from registry)

Use `deploy/docker-compose.vm.yml` when your VM should only pull prebuilt images from Docker Hub (no local build on VM).

### Step 1. Get the latest compose file on VM

If repository is cloned on VM:

```bash
git fetch origin
git checkout origin/deploy -- deploy/docker-compose.vm.yml
```

Or download directly:

```bash
curl -L "https://raw.githubusercontent.com/siloksan/yarli-verify-system/deploy/deploy/docker-compose.vm.yml" -o deploy/docker-compose.vm.yml
```

### Step 2. Create VM env file

Create `.env` on VM:

```env
API_IMAGE=<dockerhub-username>/yarli-api
WEB_IMAGE=<dockerhub-username>/yarli-web
IMAGE_TAG=deploy

POSTGRES_USER=yarli
POSTGRES_PASSWORD=change_me
POSTGRES_DB=yarli_verify

API_DOC_PATH=api/docs
API_DOC_VERSION=1.0.0
OPEN_API_VERSION=3.0.0

TELEGRAM_ENABLED=false
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Variable description for VM:

- `API_IMAGE`: Docker image repository for API service.
- `WEB_IMAGE`: Docker image repository for web service.
- `IMAGE_TAG`: image tag to deploy (`deploy`, `latest`, or a specific sha tag).
- `POSTGRES_USER`: PostgreSQL username.
- `POSTGRES_PASSWORD`: PostgreSQL password.
- `POSTGRES_DB`: PostgreSQL database name.
- `API_DOC_PATH`: Swagger route path in API.
- `API_DOC_VERSION`: Swagger version value.
- `OPEN_API_VERSION`: OpenAPI spec version.
- `TELEGRAM_ENABLED`: enables Telegram notifications in API.
- `TELEGRAM_BOT_TOKEN`: Telegram bot token.
- `TELEGRAM_CHAT_ID`: Telegram destination chat/channel ID.

Important for VM web deploy:

- `VITE_API_BASE_URL` is a Vite build-time variable (Docker `build-arg`), not a runtime container env for `docker-compose.vm.yml`.
- To change browser API target in VM deploy, rebuild/push `yarli-web` with the correct `WEB_VITE_API_BASE_URL` (GitHub Actions variable), then `pull` and recreate the `web` container.

### Step 3. Pull images

```bash
docker compose --env-file .env -f deploy/docker-compose.vm.yml pull
```

### Step 4. Start PostgreSQL first

```bash
docker compose --env-file .env -f deploy/docker-compose.vm.yml up -d postgres
```

### Step 5. Run migrations

```bash
docker compose --env-file .env -f deploy/docker-compose.vm.yml --profile tools run --rm api-migrate
```

### Step 6. (Optional) Seed data

```bash
docker compose --env-file .env -f deploy/docker-compose.vm.yml --profile tools run --rm api-seed
```

### Step 7. Start API and Web

```bash
docker compose --env-file .env -f deploy/docker-compose.vm.yml up -d api web
```

### Step 8. Verify deployment

```bash
docker compose --env-file .env -f deploy/docker-compose.vm.yml ps
docker compose --env-file .env -f deploy/docker-compose.vm.yml logs --tail=100 api
docker compose --env-file .env -f deploy/docker-compose.vm.yml logs --tail=100 web
```

Browser checks (VM):

- Open web app: `http://<VM_HOST_OR_IP>/`
- Open Swagger UI: `http://<VM_HOST_OR_IP>:3000/${API_DOC_PATH}` (default: `http://<VM_HOST_OR_IP>:3000/api/docs`)

Example for VM IP `82.202.137.69`:

- Web app: `http://82.202.137.69/`
- Swagger: `http://82.202.137.69:3000/api/docs`

If you cannot open pages from outside VM:

- allow inbound `80/tcp` and `3000/tcp` in firewall/security group
- verify services are `Up` with `docker compose ... ps`

### Update to a newer image version

1. Update `IMAGE_TAG` in `.env` (for example to new `deploy`/`sha` tag).
2. Pull and restart:

```bash
docker compose --env-file .env -f deploy/docker-compose.vm.yml pull
docker compose --env-file .env -f deploy/docker-compose.vm.yml up -d postgres
docker compose --env-file .env -f deploy/docker-compose.vm.yml --profile tools run --rm api-migrate
docker compose --env-file .env -f deploy/docker-compose.vm.yml up -d api web
```

### Stop services

```bash
docker compose --env-file .env -f deploy/docker-compose.vm.yml down
```

## CI Docker images

Workflow: `.github/workflows/docker-images.yml`

- `push` to `main` and `deploy`
- `pull_request` to `deploy` (build only, no push)
- `main` tags: `latest` + `sha`
- `deploy` tags: `deploy` + `sha`
