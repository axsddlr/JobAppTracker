# Build stage
FROM node:21-alpine AS builder

WORKDIR /usr/src/app

COPY . .
RUN npm install

# Disable Next.js telemetry
RUN npx next telemetry disable

RUN npm run build

# Development stage
FROM node:21-alpine AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
