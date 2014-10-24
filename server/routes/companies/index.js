var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/companies',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/companies/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/companies',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/companies/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/companies/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/members/{id}/companies',
  config: handlers.getByMember
});

server.route({
  method: 'GET',
  path: '/events/{id}/companies',
  config: handlers.getByEvent
});
