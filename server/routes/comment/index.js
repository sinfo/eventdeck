var server = require('server').hapi;
var handlers = require('./handlers');

require('./methods');


server.route({
  method: 'GET',
  path: '/api/comment',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/comment/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/comment',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/comment/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/comment/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/api/company/{id}/comments',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/speaker/{id}/comments',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/topic/{id}/comments',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/member/{id}/comments',
  config: handlers.getByMember
});
