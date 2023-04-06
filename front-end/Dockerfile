FROM node:19

WORKDIR /usr/front-end

COPY package.json ./

RUN [ "npm", "ci" ]

COPY . .

RUN [ "npm", "run", "build" ]

# Start the app
CMD [ "npm", "run", "start" ]
