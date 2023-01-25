FROM node:14

WORKDIR /usr/backend

COPY . .

RUN [ "npm", "install" ]
RUN [ "npm", "run", "build" ]

# Start the app
CMD [ "npm", "run", "start" ]