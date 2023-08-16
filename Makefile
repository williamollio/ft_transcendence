uibuild :
	sudo docker-compose build ui --no-cache

uiup :
	sudo docker-compose up ui

uiclean:
	sudo docker image rm ft_transcendence_ui

nginxup :
	sudo docker-compose up nginx

nestbuild :
	sudo docker-compose build nest --no-cache

nestup :
	sudo docker-compose up nest

nestclean:
	sudo docker image rm ft_transcendence_nest

build :
	sudo docker-compose build

up :
	sudo docker-compose up --build

down :
	sudo docker-compose down

fclean :
	sudo docker system prune -af --volumes
	sudo docker network prune -f

ps :
	sudo docker-compose ps

info :
	sudo docker system df
