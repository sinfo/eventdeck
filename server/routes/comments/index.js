var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/comments',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/comments/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/comments',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/comments/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/comments/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/companies/{id}/comments',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/speakers/{id}/comments',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/topics/{id}/comments',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/communications/{id}/comments',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/members/{id}/comments',
  config: handlers.getByMember
});
