FROM		node:20

ARG		REACT_APP_API_PROTOCOL
ARG		REACT_APP_API_HOST
ARG		REACT_APP_API_PORT
ARG		REACT_APP_API_URL_42

WORKDIR	/usr/front-end

#~~ INSTALLING DEPENDENCIES
RUN			[ "apt-get", "update" ]
RUN			[ "apt-get", "upgrade", "-y" ]
COPY		package.json .
RUN			[ "npm", "config", "set", "legacy-peer-deps", "true" ]
RUN			[ "npm", "install"]

#~~ INSTALL serve
#~~ PROD
RUN		[ "apt-get", "install", "xsel" ]
RUN		[ "npm", "install", "-g", "serve"]

#~~ COPYING CODE
COPY		. .

#~~ BUILDING AND RUNNING SERVER
RUN			[ "npm", "run", "build" ]
#~~ DEV
# ENTRYPOINT	[ "npm", "run", "start" ]
#~~ PROD
ENTRYPOINT [ "serve", "-s", "build" ]
