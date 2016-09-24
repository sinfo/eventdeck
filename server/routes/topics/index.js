var server = require('../../index').hapi
var handlers = require('./handlers')

server.route({
  method: 'GET',
  path: '/api/topics',
  config: handlers.list
})

server.route({
  method: 'GET',
  path: '/api/topics/{id}',
  config: handlers.get
})

server.route({
  method: 'POST',
  path: '/api/topics',
  config: handlers.create
})

server.route({
  method: ['PUT', 'PATCH'],
  path: '/api/topics/{id}',
  config: handlers.update
})

server.route({
  method: 'DELETE',
  path: '/api/topics/{id}',
  config: handlers.remove
})

server.route({
  method: 'GET',
  path: '/api/members/{id}/topics',
  config: handlers.getByMember
})
