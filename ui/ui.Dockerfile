FROM node:16-alpine

RUN apk update && apk add bash && npm update -g npm

WORKDIR /app/ui

COPY . .

EXPOSE 3000

CMD ["/bin/bash", "-c", "npm install && npm run start"]