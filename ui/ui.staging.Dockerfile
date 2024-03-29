FROM node:alpine

RUN apk update && \
    apk add bash && \
    npm update -g npm

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "preview"]
