var server = require('server').hapi;
var handlers = require('./handlers');

require('./methods');


server.route({
  method: 'GET',
  path: '/api/item',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/item/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/item',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/item/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/item/{id}',
  config: handlers.remove
});