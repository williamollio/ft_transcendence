# ft_transcendance

[Subject PDF](https://github.com/williamollio/ft_transcendance/blob/william/ressources/ft_transcendance.pdf)

[Notes](https://github.com/williamollio/ft_transcendance/blob/master/notes.md)

## Work on ft_transcendance

- `make up` for building the image and for spinning up the containers.
- For stopping the app run `make down`.

## UI

### Docker setup

#### Prerequisites

- Node.js and npm (or yarn) installed locally

#### Build and run the application

1. Install dependencies by running `npm install` or `yarn install`
2. Build the Docker image using `docker-compose build`
3. Start the container using `docker-compose up`
4. The application will be available at http://localhost:3000

#### Update dependencies

1. Add new dependencies by running `npm install <package-name>` or `yarn add <package-name>`
2. Rebuild the Docker image using `docker-compose build`
3. Restart the container using `docker-compose up`

## Nest

To seed the database run : `docker exec -it nest npx prisma db seed`
To reset and to seed it run : `docker exec -it npx prisma migrate reset`

## Links

Nest Server : http://localhost:8080
Swagger : http://localhost:8080/api

React App : http://localhost:3000/
