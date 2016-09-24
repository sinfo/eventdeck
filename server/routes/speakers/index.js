var server = require('../../index').hapi
var handlers = require('./handlers')

server.route({
  method: 'GET',
  path: '/api/speakers',
  config: handlers.list
})

server.route({
  method: 'GET',
  path: '/api/speakers/{id}',
  config: handlers.get
})

server.route({
  method: 'POST',
  path: '/api/speakers',
  config: handlers.create
})

server.route({
  method: ['PUT', 'PATCH'],
  path: '/api/speakers/{id}',
  config: handlers.update
})

server.route({
  method: 'DELETE',
  path: '/api/speakers/{id}',
  config: handlers.remove
})

server.route({
  method: 'GET',
  path: '/api/members/{id}/speakers',
  config: handlers.getByMember
})
