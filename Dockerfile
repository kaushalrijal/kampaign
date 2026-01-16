# 1) Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2) Run stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Only copy what we need to run
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

RUN npm ci --omit=dev

# Create logs and tmp directories for runtime
RUN mkdir -p /app/logs/campaigns /app/tmp

EXPOSE 3000

CMD ["npm", "start"]