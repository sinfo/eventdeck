var server = require('server').hapi;
var handlers = require('./handlers');

require('./methods');


server.route({
  method: 'GET',
  path: '/api/event',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/event/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/event',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/event/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/event/{id}',
  config: handlers.remove
});