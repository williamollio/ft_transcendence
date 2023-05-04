# ft_transcendence

[Subject PDF](https://github.com/williamollio/ft_transcendence/blob/master/ressources/ft_transcendence.pdf)


https://user-images.githubusercontent.com/61702477/236310539-5e2d362f-61b5-4e41-b535-0036b1137c3f.mov



https://user-images.githubusercontent.com/61702477/236310758-58669595-c335-4b27-88b5-047e3b553d14.mov



https://user-images.githubusercontent.com/61702477/236310810-bc0ff4bb-2463-4953-b527-e1005eb08870.mov



https://user-images.githubusercontent.com/61702477/236310834-502e35f4-0aa9-4ea4-bd15-5f4c5812a7f6.mov



https://user-images.githubusercontent.com/61702477/236310888-a3cba469-102d-4ab7-ac0f-f204b7152a31.mov



https://user-images.githubusercontent.com/61702477/236310909-5df1fee6-2c3c-4f5f-a5a4-3e1d9c2e1040.mov


https://user-images.githubusercontent.com/61702477/236310925-0ff154f2-afe8-496f-8925-4ceb3e0755a5.mov



## Presentation ft_transcendence

The project aims to learn about web development and SPA. The goal of this web app is to play ping pong game with other users and to socialize with them.

## Launch ft_transcendence

- `make up` for building the images and for spinning up the containers.
- For stopping them run `make down`.

### Environment variables ft_transcendence

Set your passwords and credentials in a `.env` file which has to be located in the `nest` folder.
Use [env.example](https://github.com/williamollio/ft_transcendence/blob/master/nest/env.example) as an example. Search globally for "127.0.0.1" in the project and replace it by your ip address.

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
