var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/subscriptions',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/subscriptions',
  config: handlers.create
});

server.route({
  method: 'DELETE',
  path: '/subscriptions/{id}',
  config: handlers.remove
});