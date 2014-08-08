var server = require('./../index.js').hapi;
var event = require('./../resources/event');

server.route({
  method: 'GET',
  path: '/api/event',
  config: {
    handler: event.list,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/event/{id}',
  config: {
    handler: event.get,
    auth: true
  }
});

server.route({
  method: 'POST',
  path: '/api/event',
  config: {
    handler: event.create,
    auth: true
  }
});

server.route({
  method: 'PUT',
  path: '/api/event/{id}',
  config: {
    handler: event.update,
    auth: true
  }
});

server.route({
  method: 'DELETE',
  path: '/api/event/{id}',
  config: {
    handler: event.delete,
    auth: true
  }
});
