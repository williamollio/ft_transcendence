uibuild :
	docker compose -f docker-compose.dev.yml build ui

uiup :
	docker compose -f docker-compose.dev.yml up ui

uiclean:
	docker image rm ft_transcendance_ui

nestclean:
	docker image rm ft_transcendance_nest

build :
	docker compose -f docker-compose.dev.yml build

up :
	docker compose -f docker-compose.dev.yml up --build

down :
	docker compose -f docker-compose.dev.yml down

fclean :
	docker system prune -af --volumes
	docker network prune -f

ps :
	docker compose -f docker-compose.dev.yml ps

info :
	docker system df