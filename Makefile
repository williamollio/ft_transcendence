
up :
	docker compose up

build :
	docker compose build

down :
	docker compose down

clean :
	docker system prune -a -f

fclean :
	docker system prune -a -f --volumes

ps :
	docker compose ps

postgres :
	docker compose up postgres

nest :
	docker compose up nest

ui :
	docker compose up ui

info :
	docker system df