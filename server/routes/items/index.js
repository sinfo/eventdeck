var server = require('server').hapi
var handlers = require('./handlers')

server.route({
  method: 'GET',
  path: '/api/items',
  config: handlers.list
})

server.route({
  method: 'GET',
  path: '/api/items/{id}',
  config: handlers.get
})

server.route({
  method: 'POST',
  path: '/api/items',
  config: handlers.create
})

server.route({
  method: ['PUT', 'PATCH'],
  path: '/api/items/{id}',
  config: handlers.update
})

server.route({
  method: 'DELETE',
  path: '/api/items/{id}',
  config: handlers.remove
})
