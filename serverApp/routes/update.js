var server = require('./../index.js').hapi;
var update = require('./../resources/update');

server.route({
  method: 'GET',
  path: '/api/update',
  config: {
    handler: update.list,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/update/{id}',
  config: {
    handler: update.get,
    auth: true
  }
});
