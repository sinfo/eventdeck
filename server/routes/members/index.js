var server = require('../../index').hapi
var handlers = require('./handlers')

server.route({
  method: 'GET',
  path: '/api/members',
  config: handlers.list
})

server.route({
  method: 'GET',
  path: '/api/members/{id}',
  config: handlers.get
})

server.route({
  method: 'GET',
  path: '/api/members/me',
  config: handlers.getMe
})

server.route({
  method: ['PUT', 'PATCH'],
  path: '/api/members/me',
  config: handlers.updateMe
})

server.route({
  method: 'POST',
  path: '/api/members',
  config: handlers.create
})

server.route({
  method: ['PUT', 'PATCH'],
  path: '/api/members/{id}',
  config: handlers.update
})

server.route({
  method: 'DELETE',
  path: '/api/members/{id}',
  config: handlers.remove
})

server.route({
  method: 'GET',
  path: '/api/companies/{id}/subscribers',
  config: handlers.getSubscribers
})

server.route({
  method: 'GET',
  path: '/api/speakers/{id}/subscribers',
  config: handlers.getSubscribers
})

server.route({
  method: 'GET',
  path: '/api/topics/{id}/subscribers',
  config: handlers.getSubscribers
})
