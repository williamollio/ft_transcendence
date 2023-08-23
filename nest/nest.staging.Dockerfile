FROM node:alpine

RUN npm update -g npm

WORKDIR /app/nest

COPY . .

RUN npx prisma generate

EXPOSE 8080
EXPOSE 3333
EXPOSE 8888

CMD ["npm", "run", "start:migrate:prod"]
