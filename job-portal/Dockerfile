# ---- Stage 1: build the React app ----
FROM node:18-alpine AS build
WORKDIR /app

# CI=false so lint warnings don't fail the production build.
ENV CI=false
# Relative API base — nginx proxies /api to the backend on the same origin.
ENV REACT_APP_API_URL=/api

COPY frontend/package.json frontend/package-lock.json ./
# npm install (not `npm ci`) tolerates the repo's slightly out-of-sync lockfile,
# which strict `npm ci` rejects across npm versions. --no-audit/--no-fund keep the
# build output clean and fast.
RUN npm install --no-audit --no-fund

COPY frontend/ ./
RUN npm run build

# ---- Stage 2: serve the build with nginx ----
FROM nginx:1.27-alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
