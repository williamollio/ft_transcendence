
up :
	docker compose -f docker-compose.dev.yml up

build :
	docker compose -f docker-compose.dev.yml build

down :
	docker compose -f docker-compose.dev.yml down

clean :
	docker system prune -a -f
	rm -Rf nest/node_modules
	rm -Rf ui/node_modules

fclean : clean
	docker system prune -a -f --volumes

ps :
	docker compose -f docker-compose.dev.yml ps

info :
	docker system df