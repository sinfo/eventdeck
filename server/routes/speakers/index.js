var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/speakers',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/speakers/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/speakers',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/speakers/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/speakers/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/members/{id}/speakers',
  config: handlers.getByMember
});
