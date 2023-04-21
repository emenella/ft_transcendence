FROM node:19

WORKDIR /usr/front-end

COPY package.json .

RUN [ "apt-get", "update" ]
RUN [ "apt-get", "-y", "upgrade"]
RUN [ "apt-get", "install", "xsel" ]
RUN [ "npm", "install"]
RUN [ "npm", "install", "-g", "serve"]

COPY . .

RUN [ "npm", "run", "build" ]

ENTRYPOINT [ "serve", "-s", "build" ]
