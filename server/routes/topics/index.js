var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/topics',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/topics/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/topics',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/topics/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/topics/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/members/{id}/topics',
  config: handlers.getByMember
});
