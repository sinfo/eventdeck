var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/tags',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/tags/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/tags',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/tags/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/tags/{id}',
  config: handlers.remove
});