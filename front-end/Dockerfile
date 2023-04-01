FROM node:19

WORKDIR /usr/front-end

COPY package*.json ./

COPY . .

RUN [ "npm", "install"]

RUN [ "npm", "run", "build" ]

# Start the app
CMD [ "npm", "run", "start" ]
