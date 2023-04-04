FROM node:19

WORKDIR /usr/front-end

COPY package*.json ./

COPY . .

RUN [ "npm", "ci"]

RUN [ "npm", "run", "build" ]

# Start the app
CMD [ "npm", "run", "start" ]
