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

RUN addgroup -g 1001 -S app && adduser -S app -u 1001 -G app

WORKDIR /usr/src/app

ENV NODE_ENV=production \
    SQLITE_PATH=/usr/src/app/data/jobapp.db

COPY --from=builder --chown=app:app /usr/src/app/.next/standalone ./
COPY --from=builder --chown=app:app /usr/src/app/.next/static ./.next/static

RUN mkdir -p data && chown app:app data

USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000',r=>process.exit(r.statusCode!==200?1:0))"

CMD ["node", "server.js"]
