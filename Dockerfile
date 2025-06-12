
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN VITE_API_URL=__API_URL__ npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d


COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


EXPOSE 80


ENTRYPOINT ["/entrypoint.sh"] 