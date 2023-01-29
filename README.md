# ft_transcendance

[Subject PDF](https://github.com/williamollio/ft_transcendance/blob/master/ressources/ft_transcendance.pdf)

## Launch ft_transcendance

- `make up` for building the images and for spinning up the containers.
- For stopping them run `make down`.

## UI

### Docker setup

#### Prerequisites

- Node.js and npm (or yarn) installed locally

#### Build and run the application

1. Go to the `ui` folder and install dependencies by running `npm install` or `yarn install`
2. Go back at the root of the project and build the image by using `make uibuild`
3. Run the container via `make uiup`
4. The application will be available at http://localhost:3000

The app ist compatible with the browsers Chrome and Firefox.

#### Update dependencies

1. Add new dependencies by running `npm install <package-name>` or `yarn add <package-name>`
2. Rebuild the Docker image using `make uibuild`
3. Restart the container using `make uiup`

## Nest

- To seed the database run : `docker exec -it nest npx prisma db seed`
- To reset and to seed it run : `docker exec -it nest npx prisma migrate reset`

## Links

- **React App** : http://localhost:3000/
- **Nest Server** : http://localhost:8080
- **Swagger** : http://localhost:8080/api
