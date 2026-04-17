FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package.json
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY tsconfig.base.json tsconfig.base.json
COPY backend/tsconfig.json backend/tsconfig.json
COPY backend backend

RUN npm install
RUN npm run build --workspace backend

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV TODO_DB_PATH=/app/backend/data/todos.sqlite

COPY package.json package.json
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN npm install --omit=dev --workspace backend

COPY --from=build /app/backend/dist backend/dist

RUN mkdir -p /app/backend/data && chown -R node:node /app

USER node

EXPOSE 3001

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- http://127.0.0.1:3001/health >/dev/null || exit 1

CMD ["node", "backend/dist/server.js"]
