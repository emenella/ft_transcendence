FROM		node:20

WORKDIR		/usr/back-end

#~~ INSTALLING DEPENDENCIES
RUN			[ "apt-get", "update" ]
RUN			[ "apt-get", "upgrade", "-y" ]
COPY		package.json .
RUN			[ "npm", "install"]

#~~ COPYING CODE
COPY		. .

#~~ BUILDING AND RUNNING SERVER
RUN			[ "npm", "run", "build" ]
#~~ DEV
# ENTRYPOINT	[ "npm", "run", "start:dev" ]
#~~ PROD
ENTRYPOINT [ "npm", "run", "start:prod" ]
