# ft_transcendance

[Subject PDF](https://github.com/williamollio/ft_transcendance/blob/william/ressources/ft_transcendance.pdf)

[Notes](https://github.com/williamollio/ft_transcendance/blob/master/notes.md)

## Work on ft_transcendance

`make up` for building the image and for spinning up the containers.
For stopping the app run `make down`.
<strong>Development experience needs to be improved</strong> : Always run `make uiclean` before relaunching the app run

### ui

Adding new dependencies won't update the folder `app/cache/node_modules` in the container so for this reason always launch the app with `make up`. Furthermore, if you do `git pull` or `git checkout` run `make down` then `make uiclean` and `make up` again.

### nest

For seeding the database run : `docker exec -it nest npx prisma db seed`

## Commands to know

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
