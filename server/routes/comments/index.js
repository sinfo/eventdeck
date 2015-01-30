var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/api/comments',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/comments/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/comments',
  config: handlers.create
});

server.route({
  method: ['PUT','PATCH'],
  path: '/api/comments/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/comments/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/api/companies/{id}/comments',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/speakers/{id}/comments',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/topics/{id}/comments',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/comments/{id}/comments',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/communications/{id}/comments',
  config: handlers.getBySubthread
});

server.route({
  method: 'GET',
  path: '/api/members/{id}/comments',
  config: handlers.getByMember
});

server.route({
  method: 'GET',
  path: '/api/{threadKind}/{threadId}/comments/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/{threadKind}/{threadId}/comments',
  config: handlers.create
});

server.route({
  method: ['PUT','PATCH'],
  path: '/api/{threadKind}/{threadId}/comments/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/{threadKind}/{threadId}/comments/{id}',
  config: handlers.remove
});

