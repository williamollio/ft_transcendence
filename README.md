# ft_transcendence

[Subject PDF](https://github.com/williamollio/ft_transcendence/blob/master/ressources/ft_transcendence.pdf)

## How to run it

- `make up` for building the images and for spinning up the containers.
- For stopping them run `make down`.

### Environment variables ft_transcendence

Set your passwords and credentials in a `.env` file which has to be located in the `nest` folder.
Use [./nest/env.example](https://github.com/williamollio/ft_transcendence/blob/master/nest/env.example), [./env.example](https://github.com/williamollio/ft_transcendence/blob/master/env.example) and [./ui/env.example](https://github.com/williamollio/ft_transcendence/blob/master/ui/env.example) as an examples.

### UI

1. Go to the root of the project and build the image by using `make uibuild`
2. Run the container via `make uiup`
3. The application will be available at http://IP_ADDRESS:3000
4. For the development experience : go to the `ui` folder and install dependencies by running `npm install <package-name>` or `yarn add <package-name>`

The app is compatible with the browsers Chrome and Firefox.

### Nest

1. Go to the root of the project and build the image by using `make nestbuild`
2. Run the container via `make nestup`
3. The application will be available at http://IP_ADDRESS:8080

- To seed the database run : `docker exec -it nest npx prisma db seed`
- To reset and to seed it run : `docker exec -it nest npx prisma migrate reset`

### Update dependencies

1. Go to the corresponding "xxx" folder and add new dependencies by running `npm install <package-name>` or `yarn add <package-name>`
2. Rebuild the Docker image using `make xxxbuild`
3. Restart the container using `make xxxup`

### Links

- **React App** : http://IP_ADDRESS:3000/
- **Nest Server** : http://IP_ADDRESS:8080
- **Swagger** : http://IP_ADDRESS:8080/api
