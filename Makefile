uibuild :
	docker compose build ui --no-cache

uiup :
	docker compose up ui

uiclean:
	docker image rm ft_transcendance_ui

nestbuild :
	docker compose build nest --no-cache

nestup :
	docker compose up nest

nestclean:
	docker image rm ft_transcendance_nest

build :
	docker compose build

up :
	docker compose up --build

down :
	docker compose down

fclean :
	docker system prune -af --volumes
	docker network prune -f

ps :
	docker compose ps

info :
	docker system df
