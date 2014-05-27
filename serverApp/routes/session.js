var server = require('./../index.js').hapi;
var session = require('./../resources/session');

server.route({
  method: 'GET',
  path: '/api/session',
  config: {
    handler: session.list,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/session/{id}',
  config: {
    handler: session.get,
    auth: true
  }
});

server.route({
  method: 'POST',
  path: '/api/session',
  config: {
    handler: session.create,
    auth: true
  }
});

server.route({
  method: 'PUT',
  path: '/api/session/{id}',
  config: {
    handler: session.update,
    auth: true
  }
});

server.route({
  method: 'DELETE',
  path: '/api/session/{id}',
  config: {
    handler: session.delete,
    auth: true
  }
});
