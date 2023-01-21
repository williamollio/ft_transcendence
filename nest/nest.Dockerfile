FROM node:17-alpine

RUN npm update -g npm

WORKDIR /app/nest

COPY package.json ./

COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "start:migrate:dev"]