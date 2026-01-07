FROM node:20-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

EXPOSE 5173

CMD ["pnpm", "--filter", "frontend", "exec", "vite"]
