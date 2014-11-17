var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/api/events',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/events/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/events',
  config: handlers.create
});

server.route({
  method: ['PUT','PATCH'],
  path: '/api/events/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/events/{id}',
  config: handlers.remove
});