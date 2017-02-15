const server = require('../../index').hapi
const handlers = require('./handlers')

server.route({
  method: 'GET',
  path: '/api/messages',
  config: handlers.list
})

server.route({
  method: 'GET',
  path: '/api/messages/{id}',
  config: handlers.get
})
