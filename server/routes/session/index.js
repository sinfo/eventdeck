var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/api/session',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/session/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/session',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/session/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/session/{id}',
  config: handlers.remove
});