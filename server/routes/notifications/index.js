var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/api/notifications',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/notifications/{id}',
  config: handlers.get
});

server.route({
  method: 'GET',
  path: '/api/members/{id}/notifications',
  config: handlers.getByMember
});

server.route({
  method: 'GET',
  path: '/api/companies/{id}/notifications',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/speakers/{id}/notifications',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/topics/{id}/notifications',
  config: handlers.getByThread
});