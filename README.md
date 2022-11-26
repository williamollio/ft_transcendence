# ft_transcendence

[Subject PDF](https://github.com/williamollio/ft_transcendance/blob/william/ressources/ft_transcendance.pdf)

## Launch the app

For launching the app run `make up`
For stopping the app run `make down`

## Development experience

To get rid of the code highlighting, just install the node_modules locally via `npm install`

## Commands to know

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
