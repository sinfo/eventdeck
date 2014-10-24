var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/notifications',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/notifications/{id}',
  config: handlers.get
});

server.route({
  method: 'GET',
  path: '/companies/{id}/notifications',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/speakers/{id}/notifications',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/topics/{id}/notifications',
  config: handlers.getByThread
});