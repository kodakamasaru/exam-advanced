FROM node:20-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/

RUN pnpm install --filter frontend

EXPOSE 5173

CMD ["pnpm", "--filter", "frontend", "exec", "vite"]
