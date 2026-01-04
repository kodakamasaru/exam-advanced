#!/bin/sh
set -e

echo "Running migrations..."
pnpm --filter backend exec drizzle-kit migrate

echo "Running seed..."
pnpm --filter backend exec tsx scripts/seeds/index.ts

echo "Starting API server..."
exec pnpm --filter backend exec tsx watch src/server.ts
