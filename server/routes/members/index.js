var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/members',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/members/{id}',
  config: handlers.get
});

server.route({
  method: 'GET',
  path: '/members/me',
  config: handlers.getMe
});

server.route({
  method: 'POST',
  path: '/members',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/members/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/members/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/role/{id}/members',
  config: handlers.getByRole
});

server.route({
  method: 'GET',
  path: '/role/teamleaders',
  config: handlers.getTeamLeaders
});

server.route({
  method: 'GET',
  path: '/companies/{id}/subscribers',
  config: handlers.getSubscribers
});

server.route({
  method: 'GET',
  path: '/speakers/{id}/subscribers',
  config: handlers.getSubscribers
});

server.route({
  method: 'GET',
  path: '/topics/{id}/subscribers',
  config: handlers.getSubscribers
});
