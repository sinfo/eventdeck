var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/api/member',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/member/{id}',
  config: handlers.get
});

server.route({
  method: 'GET',
  path: '/api/member/me',
  config: handlers.getMe
});

server.route({
  method: 'POST',
  path: '/api/member',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/member/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/member/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/api/role/{id}/members',
  config: handlers.getByRole
});

server.route({
  method: 'GET',
  path: '/api/role/teamleaders',
  config: handlers.getTeamLeaders
});

server.route({
  method: 'GET',
  path: '/api/company/{id}/subscribers',
  config: handlers.getSubscribers
});

server.route({
  method: 'GET',
  path: '/api/speaker/{id}/subscribers',
  config: handlers.getSubscribers
});

server.route({
  method: 'GET',
  path: '/api/topic/{id}/subscribers',
  config: handlers.getSubscribers
});
