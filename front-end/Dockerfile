FROM node:20

ARG    VITE_API_PROTOCOL
ARG    VITE_API_HOST
ARG    VITE_API_PORT
ARG    VITE_API_LOGIN_URL

WORKDIR /usr/front-end

COPY package* .

RUN [ "apt-get", "update" ]
RUN [ "apt-get", "-y", "upgrade"]
RUN [ "apt-get", "-y", "install", "xdg-utils" ]
RUN [ "npm", "ci"]

COPY . .

RUN [ "npm", "run", "build" ]

ENTRYPOINT [ "npm", "run", "start" ]
# ENTRYPOINT [ "sh", ]
# //ENTRYPOINT infinity while true; do sleep 1000; done
# ENTRYPOINT [ "sh", 
# ENTRYPOINT [ "serve", "-s", "build" ]
