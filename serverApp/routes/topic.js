var server  = require('./../index.js');
var topic = require('./../resources/topic');

server.route({
  method: 'GET',
  path: '/api/topics',
  config: {
    handler: topic.list,
    auth: true
  }
});

server.route({
  method: 'POST',
  path: '/api/topics',
  config: {
    handler: topic.create,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/topic/{id}',
  config: {
    handler: topic.get,
    auth: true
  }
});

server.route({
  method: 'PUT',
  path: '/api/topics',
  config: {
    handler: topic.update,
    auth: true
  }
});
