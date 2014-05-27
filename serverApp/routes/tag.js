var server  = require('./../index.js').hapi;
var tag = require('./../resources/tag');
var topic   = require('./../resources/topic');

server.route({
  method: 'GET',
  path: '/api/tag',
  config: {
    handler: tag.list,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/tag/{id}',
  config: {
    handler: tag.get,
    auth: true
  }
});

server.route({
  method: 'POST',
  path: '/api/tag',
  config: {
    handler: tag.create,
    auth: true
  }
});

server.route({
  method: 'PUT',
  path: '/api/tag/{id}',
  config: {
    handler: tag.update,
    auth: true
  }
});

server.route({
  method: 'DELETE',
  path: '/api/tag/{id}',
  config: {
    handler: tag.delete,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/tag/{id}/topics',
  config: {
    handler: topic.getByTag,
    auth: true
  }
});
