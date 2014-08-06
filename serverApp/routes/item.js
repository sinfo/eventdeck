var server = require('./../index.js').hapi;
var item = require('./../resources/item');

server.route({
  method: 'GET',
  path: '/api/item',
  config: {
    handler: item.list,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/item/{id}',
  config: {
    handler: item.get,
    auth: true
  }
});

server.route({
  method: 'POST',
  path: '/api/item',
  config: {
    handler: item.create,
    auth: true
  }
});

server.route({
  method: 'PUT',
  path: '/api/item/{id}',
  config: {
    handler: item.update,
    auth: true
  }
});

server.route({
  method: 'DELETE',
  path: '/api/item/{id}',
  config: {
    handler: item.delete,
    auth: true
  }
});
