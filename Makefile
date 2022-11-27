
up :
	docker compose -f docker-compose.dev.yml up

build :
	docker compose -f docker-compose.dev.yml build

down :
	docker compose -f docker-compose.dev.yml down

clean :
	docker system prune -a -f

fclean :
	docker system prune -a -f --volumes

ps :
	docker compose ps

postgres :
	docker compose -f docker-compose.dev.yml up postgres

nest :
	docker compose -f docker-compose.dev.yml up nest

ui :
	docker compose -f docker-compose.dev.yml up ui

info :
	docker system df