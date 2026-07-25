# syntax=docker/dockerfile:1.7
# ─── deps ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ─── build ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ─── runtime ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production

# Copy node_modules from deps (keeps compiled native bindings like bcrypt),
# then prune dev deps in place — no re-compile, no re-download.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm prune --omit=dev && npm cache clean --force

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 aurora && \
    chown -R aurora:nodejs /app
USER aurora

EXPOSE 8080
ENV PORT=8080
CMD ["node", "dist/src/main.js"]
