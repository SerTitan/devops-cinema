# ЭТАП СБОРКИ ---------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_API_BASE      # <--- добавили
ENV VITE_API_BASE=$VITE_API_BASE
RUN npm run build      # переменная попадает в бандл

FROM nginx:1.26-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
	