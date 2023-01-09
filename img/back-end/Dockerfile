FROM alpine:3.17.0

ARG MODE

VOLUME ["/usr/back-end"]
WORKDIR /usr/back-end

RUN npm install

CMD ["npm", "run", MODE]