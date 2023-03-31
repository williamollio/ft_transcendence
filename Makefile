uibuild :
	docker compose -f docker-compose.dev.yml build ui --no-cache

uiup :
	docker compose -f docker-compose.dev.yml up ui

uiclean:
	docker image rm ft_transcendance_ui

nestbuild :
	docker compose -f docker-compose.dev.yml build nest  --no-cache

nestup :
	docker compose -f docker-compose.dev.yml up nest

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
# rm -Rf nest/node_modules
# rm -Rf ui/node_modules

ps :
	docker compose -f docker-compose.dev.yml ps

info :
	docker system df