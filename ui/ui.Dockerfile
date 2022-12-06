FROM node:16-alpine

RUN apk update && apk add bash && npm update -g npm

WORKDIR /app/cache

COPY package*.json ./

RUN npm install --legacy-peer-deps

WORKDIR /app/ui

COPY . .

EXPOSE 3000

CMD ["/bin/bash", "-c", "cp -r /app/cache/node_modules/ /app/ui/node_modules/ && npm run start"]