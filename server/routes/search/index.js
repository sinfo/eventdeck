var server = require('server').hapi;
var handlers = require('./handlers');

server.route({
  method: 'GET',
  path: '/api/search/{str}',
  config: handlers.search
});
