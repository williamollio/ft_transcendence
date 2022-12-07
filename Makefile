
up :
	docker compose -f docker-compose.dev.yml up --build

build :
	docker compose -f docker-compose.dev.yml build

down :
	docker compose -f docker-compose.dev.yml down

clean nest:
	rm -Rf nest/node_modules
	docker image rm ft_transcendance_nest

clean ui:
	rm -Rf ui/node_modules
	docker image rm ft_transcendance_ui

fclean :
	rm -Rf nest/node_modules
	rm -Rf ui/node_modules
	docker system prune -a -f --volumes
	docker network prune -f

ps :
	docker compose -f docker-compose.dev.yml ps

info :
	docker system df