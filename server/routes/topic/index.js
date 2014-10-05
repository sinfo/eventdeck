var server = require('server').hapi;
var handlers = require('./handlers');

require('./methods');


server.route({
  method: 'GET',
  path: '/api/topic',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/topic/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/topic',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/topic/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/topic/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/api/member/{id}/topics',
  config: handlers.getByMember
});
