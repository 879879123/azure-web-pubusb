FROM node:18.9-buster-slim AS builder
COPY package.json ./
COPY package-lock.json ./
RUN npm install && mkdir /usr/src/app && mv ./node_modules /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm run build:prod
FROM nginx:1.23.1-alpine AS runtime-image
COPY nginx/default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
CMD ["/bin/sh",  "-c",  "exec nginx -g 'daemon off;'"]
