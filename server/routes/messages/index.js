var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/messages',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/messages/{id}',
  config: handlers.get
});
