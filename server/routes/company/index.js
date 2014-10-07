var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/api/company',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/company/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/company',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/company/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/company/{id}',
  config: handlers.remove
});

server.route({
  method: 'GET',
  path: '/api/member/{id}/companies',
  config: handlers.getByMember
});
