const server = require('../../index').hapi
const handlers = require('./handlers')

server.route({
  method: 'GET',
  path: '/api/communications',
  config: handlers.list
})

server.route({
  method: 'GET',
  path: '/api/communications/{id}',
  config: handlers.get
})

server.route({
  method: 'POST',
  path: '/api/communications',
  config: handlers.create
})

server.route({
  method: ['PUT', 'PATCH'],
  path: '/api/communications/{id}',
  config: handlers.update
})

server.route({
  method: 'DELETE',
  path: '/api/communications/{id}',
  config: handlers.remove
})

server.route({
  method: 'GET',
  path: '/api/companies/{id}/communications',
  config: handlers.getByThread
})

server.route({
  method: 'GET',
  path: '/api/speakers/{id}/communications',
  config: handlers.getByThread
})

server.route({
  method: 'GET',
  path: '/api/members/{id}/communications',
  config: handlers.getByMember
})

server.route({
  method: 'GET',
  path: '/api/events/{id}/communications',
  config: handlers.getByEvent
})

server.route({
  method: 'GET',
  path: '/api/{threadKind}/{threadId}/communications/{id}',
  config: handlers.get
})

server.route({
  method: 'GET',
  path: '/api/{threadKind}/{threadId}/communications/{id}/view',
  config: handlers.getView
})

server.route({
  method: 'POST',
  path: '/api/{threadKind}/{threadId}/communications',
  config: handlers.create
})

server.route({
  method: ['PUT', 'PATCH'],
  path: '/api/{threadKind}/{threadId}/communications/{id}',
  config: handlers.update
})

server.route({
  method: 'DELETE',
  path: '/api/{threadKind}/{threadId}/communications/{id}',
  config: handlers.remove
})
