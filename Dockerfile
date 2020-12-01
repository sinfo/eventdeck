FROM ubuntu:16.04

RUN useradd -ms /bin/bash node

RUN apt-get update
RUN apt-get install -y gcc python make

# install node 0.10.36
ADD https://nodejs.org/dist/v0.10.36/node-v0.10.36-linux-x64.tar.gz .
RUN tar -xzf node-v0.10.36-linux-x64.tar.gz \
    && rm /node-v0.10.36-linux-x64.tar.gz

RUN mkdir /home/node/.npm-global ; \
    mkdir -p /home/node/app ; \
    chown -R node:node /home/node/app ; \
    chown -R node:node /home/node/.npm-global

USER node

ENV PATH=/node-v0.10.36-linux-x64/bin:/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN npm i -g bunyan@1.8.12

WORKDIR /home/node/app
COPY . .

ENTRYPOINT [ "npm", "start" ]
