var server = require('server').hapi;
var handlers = require('./handlers');

require('./methods');


server.route({
  method: 'GET',
  path: '/api/meeting',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/meeting/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/meeting',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/meeting/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/meeting/{id}',
  config: handlers.remove
});