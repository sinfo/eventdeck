var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/events',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/events/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/events',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/events/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/events/{id}',
  config: handlers.remove
});