FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package.json
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY tsconfig.base.json tsconfig.base.json
COPY frontend/tsconfig.json frontend/tsconfig.json
COPY frontend frontend

RUN npm install
RUN npm run build --workspace frontend

FROM nginx:alpine AS runtime

COPY frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /etc/nginx /tmp

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
