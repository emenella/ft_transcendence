#========================================#
#=============== VARIABLES ==============#
#========================================#

#~~~~ DOCKER ~~~~#

NAME			= pong
COMPOSE			= docker-compose --project-directory=. -p $(NAME)

#========================================#
#=============== TARGETS ================#
#========================================#

#~~~~ Main ~~~~#

all:		up logs

re:			down vclean all
# Create and start containers
up:			build
			$(COMPOSE) up --detach --remove-orphans
# Stop and remove containers and networks
down:
			$(COMPOSE) down

#~~~~ Build ~~~~#
# Build or rebuild services
build:
			$(COMPOSE) build --parallel
# Create services
create:		build
			$(COMPOSE) create

#~~~~ Debug ~~~~#
# List containers
ps:
			$(COMPOSE) ps --all
# Execute bash in the container $(CONTAINER)
exec:
ifeq "$(CONTAINER)" ""
	@echo "Usage: CONTAINER=<CONTAINER_NAME> make exec"
else
	$(COMPOSE) exec $(CONTAINER) /bin/bash
endif
# View output from containers
logs:
ifeq "$(SERVICE)" ""
	$(COMPOSE) logs -t -f
else
	$(COMPOSE) logs -t -f $(SERVICE)
endif
			
#~~~~ Essantial ~~~~#
# Start services
start:
			$(COMPOSE) start
# Restart services
restart:
			$(COMPOSE) restart
# Stop services
stop:
			$(COMPOSE) stop

#~~~~ Cleaning ~~~~#
# Stop and remove containers, networks and images
clean:
			docker-compose --project-directory=. $(BONUS_FLAG) down --rmi all
# Stop and remove containers, networks, images, and volumes
fclean:
			docker-compose --project-directory=. $(BONUS_FLAG) down --rmi all --volumes
# Removes volumes
vclean:
			docker volume rm database

#~~~~ Misc ~~~~#
# Create a self signed ssl certificate
certificate:
			@mkdir -p ssl_credentials
			openssl req \
			-newkey rsa:2048 -nodes -keyout "ssl_credentials/ssl.key" \
			-x509 -days 365 \
			-subj "/C=FR/ST=Auvergne-Rhône-Alpes/L=Lyon/O=42-Lyon-Auvergne-Rhône-Alpes/emailAddress=pthomas@student.42lyon.fr/CN=pong.42.fr" \
			-out "ssl_credentials/ssl.crt"

#~~~~ Eugene ~~~~#

eugene :	
			@ echo "               _,........__"
			@ echo "            ,-'            \"\`-."
			@ echo "          ,'                   \`-."
			@ echo "        ,'                        \\"
			@ echo "      ,'                           ."
			@ echo "      .'\\               ,\"\".       \`"
			@ echo "     ._.'|             / |  \`       \\"
			@ echo "     |   |            \`-.'  ||       \`."
			@ echo "     |   |            '-._,'||       | \\"
			@ echo "     .\`.,'             \`..,'.'       , |\`-."
			@ echo "     l                       .'\`.  _/  |   \`."
			@ echo "     \`-.._'-   ,          _ _'   -\" \\  .     \`"
			@ echo "\`.\"\"\"\"\"'-.\`-...,---------','         \`. \`....__."
			@ echo ".'        \`\"-..___      __,'\\          \\  \\     \\"
			@ echo "\\_ .          |   \`\"\"\"\"'    \`.           . \\     \\"
			@ echo "  \`.          |              \`.          |  .     L"
			@ echo "    \`.        |\`--...________.'.        j   |     |"
			@ echo "      \`._    .'      |          \`.     .|   ,     |"
			@ echo "         \`--,\\       .            \`7\"\"' |  ,      |"
			@ echo "            \` \`      \`            /     |  |      |    _,-'\"\"\"\`-."
			@ echo "             \\ \`.     .          /      |  '      |  ,'          \`."
			@ echo "              \\  v.__  .        '       .   \\    /| /              \\"
			@ echo "               \\/    \`\"\"\\\"\"\"\"\"\"\"\`.       \\   \\  /.''                |"
			@ echo "                \`        .        \`._ ___,j.  \`/ .-       ,---.     |"
			@ echo "                ,\`-.      \\         .\"     \`.  |/        j     \`    |"
			@ echo "               /    \`.     \\       /         \\ /         |     /    j"
			@ echo "              |       \`-.   7-.._ .          |\"          '         /"
			@ echo "              |          \`./_    \`|          |            .     _,'"
			@ echo "              \`.           / \`----|          |-............\`---'"
			@ echo "                \\          \\      |          |"
			@ echo "               ,'           )     \`.         |"
			@ echo "                7____,,..--'      /          |"
			@ echo "                                  \`---.__,--.'"
								  
.PHONY:		all bonus re up down build create ps exec logs start restart stop clean fclean vclean certificate eugene
