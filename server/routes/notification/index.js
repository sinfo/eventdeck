var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/api/notification',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/notification/{id}',
  config: handlers.get
});

server.route({
  method: 'GET',
  path: '/api/company/{id}/notifications',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/speaker/{id}/notifications',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/topic/{id}/notifications',
  config: handlers.getByThread
});