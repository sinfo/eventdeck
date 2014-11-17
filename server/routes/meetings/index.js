var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/api/meetings',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/meetings/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/meetings',
  config: handlers.create
});

server.route({
  method: ['PUT','PATCH'],
  path: '/api/meetings/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/meetings/{id}',
  config: handlers.remove
});