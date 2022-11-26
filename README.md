# ft_transcendence

[Subject PDF](https://github.com/williamollio/ft_transcendance/blob/william/ressources/ft_transcendance.pdf)

## Use

Run for launch the posgres database in a container with `docker-compose up`
Go to the nest folder, download the node modules via `npm install` and launch the app with `npm run`

### Nest folder

## Commands

- npm start
- rm -rf dist/
- docker-compose up
- npx prisma migrate dev --name "..." : save db / execute SQL / generate client
- npx prisma db seed : seed the database
- npx nest generate resource : generate REST resources
- npx nest generate service/module prisma

## Links

Nest Server : http://localhost:8080
Swagger : http://localhost:8080/api
React App : http://localhost:3000/

## Good practise / Proposition

Write DTO as TS class (ref. Nest doc)
