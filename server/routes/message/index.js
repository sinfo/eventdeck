var server = require('server').hapi;
var handlers = require('./handlers');

require('./methods');


server.route({
  method: 'GET',
  path: '/api/message',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/message/{id}',
  config: handlers.get
});
