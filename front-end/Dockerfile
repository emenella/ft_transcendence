FROM node:20

ARG    REACT_APP_API_PROTOCOL
ARG    REACT_APP_API_HOST
ARG    REACT_APP_API_PORT
ARG    REACT_APP_API_LOGIN_URL

WORKDIR /usr/front-end

COPY package* .

RUN [ "apt-get", "update" ]
RUN [ "apt-get", "-y", "upgrade"]
RUN [ "apt-get", "install", "xsel" ]
RUN [ "npm", "ci"]
RUN [ "npm", "install", "-g", "serve"]

COPY . .

RUN [ "npm", "run", "build" ]

ENTRYPOINT [ "npm", "run", "start" ]
# ENTRYPOINT [ "serve", "-s", "build" ]
