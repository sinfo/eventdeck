const server = require('../../index').hapi
const handlers = require('./handlers')

server.route({
  method: 'GET',
  path: '/api/subscriptions',
  config: handlers.get
})

server.route({
  method: 'POST',
  path: '/api/subscriptions',
  config: handlers.create
})

server.route({
  method: 'DELETE',
  path: '/api/subscriptions',
  config: handlers.remove
})

server.route({
  method: 'GET',
  path: '/api/members/{id}/subscriptions',
  config: handlers.getByMember
})
