var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/items',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/items/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/items',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/items/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/items/{id}',
  config: handlers.remove
});