# Use the official lightweight Node.js 20 image.
# https://hub.docker.com/_/node
FROM node:16-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . ./

CMD [ "npm", "start" ]