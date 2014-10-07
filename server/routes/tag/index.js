var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/api/tag',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/tag/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/tag',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/tag/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/tag/{id}',
  config: handlers.remove
});