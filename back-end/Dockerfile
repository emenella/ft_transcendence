FROM node:14

WORKDIR /usr/src/app

RUN npm install

# Compile TypeScript code
RUN npm run build

# Start the app
CMD [ "npm", "start" ]