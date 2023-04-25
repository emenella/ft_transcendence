FROM node:20

ARG    REACT_APP_API_PROTOCOL
ARG    REACT_APP_API_HOST
ARG    REACT_APP_API_PORT
ARG    DEV

WORKDIR /usr/front-end

COPY package.json .

RUN [ "apt-get", "update" ]
RUN [ "apt-get", "-y", "upgrade"]
RUN [ "apt-get", "install", "xsel" ]
RUN [ "npm", "install"]
RUN [ "npm", "install", "-g", "serve"]

COPY . .

RUN [ "npm", "run", "build" ]

ENTRYPOINT [ "npm", "run", "start" ]
# ENTRYPOINT [ "serve", "-s", "build" ]
