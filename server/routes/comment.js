var server  = require('./../index.js').hapi;
var comment = require('./../resources/comment');

server.route({
  method: 'GET',
  path: '/api/comment',
  config: {
    handler: comment.list,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/comment/{id}',
  config: {
    handler: comment.get,
    auth: true
  }
});

server.route({
  method: 'POST',
  path: '/api/comment',
  config: {
    handler: comment.create,
    auth: true
  }
});

server.route({
  method: 'PUT',
  path: '/api/comment/{id}',
  config: {
    handler: comment.update,
    auth: true
  }
});

server.route({
  method: 'DELETE',
  path: '/api/comment/{id}',
  config: {
    handler: comment.delete,
    auth: true
  }
});
