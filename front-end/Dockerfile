FROM node:19

WORKDIR /usr/frontend

COPY package*.json ./

RUN [ "npm", "install"]

COPY . .

RUN [ "npm", "run", "build" ]

# Start the app
CMD [ "npm", "run", "start" ]
