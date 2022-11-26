FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]