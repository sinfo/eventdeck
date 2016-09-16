var server = require('server').hapi
var handlers = require('./handlers')

server.route({
  method: 'GET',
  path: '/api/companies',
  config: handlers.list
})

server.route({
  method: 'GET',
  path: '/api/companies/{id}',
  config: handlers.get
})

server.route({
  method: 'POST',
  path: '/api/companies',
  config: handlers.create
})

server.route({
  method: ['PUT', 'PATCH'],
  path: '/api/companies/{id}',
  config: handlers.update
})

server.route({
  method: 'DELETE',
  path: '/api/companies/{id}',
  config: handlers.remove
})

server.route({
  method: 'GET',
  path: '/api/members/{id}/companies',
  config: handlers.getByMember
})

server.route({
  method: 'GET',
  path: '/api/events/{id}/companies',
  config: handlers.getByEvent
})
