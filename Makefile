uibuild :
	docker compose -f docker-compose.dev.yml build ui

uiup :
	docker compose -f docker-compose.dev.yml up ui

uiclean:
	rm -Rf ui/node_modules
	docker image rm ft_transcendance_ui

nestclean:
	rm -Rf nest/node_modules
	docker image rm ft_transcendance_nest

build :
	docker compose -f docker-compose.dev.yml build

up :
	docker compose -f docker-compose.dev.yml up --build

down :
	docker compose -f docker-compose.dev.yml down

fclean :
	rm -Rf nest/node_modules
	rm -Rf ui/node_modules
	docker system prune -af --volumes
	docker network prune -f

ps :
	docker compose -f docker-compose.dev.yml ps

info :
	docker system df