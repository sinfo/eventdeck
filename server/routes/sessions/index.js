var server = require('../../index').hapi
var handlers = require('./handlers')

server.route({
  method: 'GET',
  path: '/api/sessions',
  config: handlers.list
})

server.route({
  method: 'GET',
  path: '/api/sessions/{id}',
  config: handlers.get
})

server.route({
  method: 'POST',
  path: '/api/sessions',
  config: handlers.create
})

server.route({
  method: ['PUT', 'PATCH'],
  path: '/api/sessions/{id}',
  config: handlers.update
})

server.route({
  method: 'DELETE',
  path: '/api/sessions/{id}',
  config: handlers.remove
})

server.route({
  method: 'GET',
  path: '/calendar.ics',
  config: handlers.getIcal
})
