var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/meetings',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/meetings/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/meetings',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/meetings/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/meetings/{id}',
  config: handlers.remove
});