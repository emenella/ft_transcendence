FROM node:20

WORKDIR /usr/backend

COPY package* .

RUN [ "npm", "ci"]

COPY . .

RUN [ "npm", "run", "build" ]

# Start the app
ENTRYPOINT [ "npm", "run", "start:dev" ]
# ENTRYPOINT [ "npm", "run", "start:prod" ]