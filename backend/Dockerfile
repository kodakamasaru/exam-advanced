FROM node:20-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

RUN pnpm install --filter backend

EXPOSE 8080

CMD ["pnpm", "--filter", "backend", "exec", "tsx", "watch", "src/server.ts"]
