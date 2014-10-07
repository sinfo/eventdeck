var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/api/chat',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/chat/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/chat',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/chat/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/chat/{id}',
  config: handlers.remove
});
