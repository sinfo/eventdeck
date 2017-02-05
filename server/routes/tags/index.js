const server = require('../../index').hapi
const handlers = require('./handlers')

server.route({
  method: 'GET',
  path: '/api/tags',
  config: handlers.list
})

server.route({
  method: 'GET',
  path: '/api/tags/{id}',
  config: handlers.get
})

server.route({
  method: 'POST',
  path: '/api/tags',
  config: handlers.create
})

server.route({
  method: ['PUT', 'PATCH'],
  path: '/api/tags/{id}',
  config: handlers.update
})

server.route({
  method: 'DELETE',
  path: '/api/tags/{id}',
  config: handlers.remove
})
