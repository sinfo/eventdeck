var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/sessions',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/sessions/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/sessions',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/sessions/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/sessions/{id}',
  config: handlers.remove
});