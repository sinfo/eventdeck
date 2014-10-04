var server = require('server').hapi;
var handlers = require('./handlers');

require('./methods');


server.route({
  method: 'GET',
  path: '/api/communication',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/communication/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/communication',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/communication/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/communication/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/api/company/{id}/communications',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/speaker/{id}/communications',
  config: handlers.getByThread
});

server.route({
  method: 'GET',
  path: '/api/member/{id}/communications',
  config: handlers.getByMember
});

server.route({
  method: 'GET',
  path: '/api/event/{id}/communications',
  config: handlers.getByEvent
});

