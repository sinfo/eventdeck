var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/communications',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/communications/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/communications',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/communications/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/communications/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/companies/{id}/communications',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/speakers/{id}/communications',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/members/{id}/communications',
  config: handlers.getByMember
});

server.route({
  method: 'GET',
  path: '/events/{id}/communications',
  config: handlers.getByEvent
});

