# Build stage
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx next telemetry disable
RUN npm run build

# Production stage
FROM node:22-alpine AS runner

RUN apk add --no-cache curl && \
    addgroup -g 1001 -S app && adduser -S app -u 1001 -G app

WORKDIR /usr/src/app

ENV NODE_ENV=production \
    SQLITE_PATH=/usr/src/app/data/jobapp.db \
    HOST=0.0.0.0 \
    PORT=3000

COPY --from=builder --chown=app:app /usr/src/app/.next/standalone ./
COPY --from=builder --chown=app:app /usr/src/app/.next/static ./.next/static

RUN mkdir -p data && chown app:app data

USER app

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD curl -f http://127.0.0.1:3000 || exit 1

CMD ["node", "server.js"]
