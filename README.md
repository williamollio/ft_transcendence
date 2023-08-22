# ft_transcendence

[Subject PDF](https://github.com/williamollio/ft_transcendence/blob/master/ressources/ft_transcendence.pdf)


## Presentation

The project aims to learn about web development and SPA. The goal of this web app is to play ping pong game with other users and to socialize with them.

https://user-images.githubusercontent.com/61702477/236314475-154911bb-aff1-4ea4-9126-8a1557216efb.mov

https://user-images.githubusercontent.com/61702477/236314792-dd094316-4aa9-4708-83ef-cab8c6852dcb.mov

https://user-images.githubusercontent.com/61702477/236314954-181a00c2-8a46-4ead-b97e-dda704171493.mov

https://user-images.githubusercontent.com/61702477/236315089-3b0c60b8-68a5-47cc-ba17-878b69b1cd1f.mov

https://user-images.githubusercontent.com/61702477/236315250-8ef1420c-e96d-4569-8446-239c94892308.mov

https://user-images.githubusercontent.com/61702477/236315368-26ca1033-4d5c-47ff-834b-da620ef9c3fc.mov

https://user-images.githubusercontent.com/61702477/236315470-dfff8132-8acf-4ffe-ae65-f570001a4632.mov

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
