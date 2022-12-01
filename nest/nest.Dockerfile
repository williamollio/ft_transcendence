FROM node:16-alpine

WORKDIR /app/nest

COPY package.json ./

COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "start:migrate:dev"]