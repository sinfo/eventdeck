var server  = require('./../index.js');
var topic = require('./../resources/topic');
var comment      = require('./../resources/comment');
var notification = require('./../resources/notification');

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
  path: '/api/topics/{id}',
  config: {
    handler: topic.targetGet,
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
  path: '/api/topic/{id}',
  config: {
    handler: topic.update,
    auth: true
  }
});

server.route({
  method: 'DELETE',
  path: '/api/topic/{id}',
  config: {
    handler: topic.delete,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/topic/{id}/comments',
  config: {
    handler: comment.getByThread,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/topic/{id}/notifications',
  config: {
    handler: notification.getByThread,
    auth: true
  }
});
