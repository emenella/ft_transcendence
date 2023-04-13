FROM node:19

WORKDIR /usr/backend

COPY package.json .

RUN [ "npm", "install"]

COPY . .

RUN [ "npm", "run", "build" ]

# Start the app
ENTRYPOINT [ "npm", "run", "start:prod" ]