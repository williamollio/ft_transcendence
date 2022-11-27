FROM node:16-alpine

WORKDIR /app/nest

COPY . .

RUN npm ci

RUN npm run build

RUN npx prisma generate

EXPOSE 8080

CMD [ "npm", "start" ]