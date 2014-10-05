var server = require('server').hapi;
var handlers = require('./handlers');

require('./methods');


server.route({
  method: 'GET',
  path: '/api/speaker',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/speaker/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/speaker',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/speaker/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/speaker/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/api/member/{id}/speakers',
  config: handlers.getByMember
});
