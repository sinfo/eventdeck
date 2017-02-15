FROM mhart/alpine-node:6.9.5

LABEL Description="The awesome web app that supports awesome events" Vendor="SINFO" Version="0.0"

WORKDIR /usr/src/app

ENV NODE_ENV production

# Build the npm modules.
COPY package.json package.json

# We need to have native dependencies (e.g to install node-gyp)
RUN apk add --no-cache make gcc g++ python git bash

RUN npm install && \
    npm cache clean && \
    npm uninstall -g npm

# We don't need this anymore
RUN apk del git python g++ gcc make

# Add the remaining source (excluding `./node_modules` thanks to `.dockerignore`).
ADD . /usr/src/app

EXPOSE 8080

CMD [ "node", "server/index.js" ]
