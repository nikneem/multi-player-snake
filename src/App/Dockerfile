FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -g npm@11.5.2 && npm ci

COPY . .
RUN npx ng build --configuration production

FROM nginx:alpine AS runtime
COPY --from=build /app/dist/snake/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY env.template.js /usr/share/nginx/html/env.template.js
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
