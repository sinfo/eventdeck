var server  = require('./../index.js');
var speaker = require('./../resources/speaker');
var comment = require('./../resources/comment');

server.route({
  method: 'GET',
  path: '/api/speaker',
  config: {
    handler: speaker.list,
    auth: true
  }
});

server.route({
  method: 'POST',
  path: '/api/speaker',
  config: {
    handler: speaker.create,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/speaker/{id}',
  config: {
    handler: speaker.get,
    auth: true
  }
});

server.route({
  method: 'PUT',
  path: '/api/speaker/{id}',
  config: {
    handler: speaker.update,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/speaker/{id}/comments',
  config: {
    handler: comment.getByThread,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/speaker/{id}/sendInitialEmail',
  config: {
    handler: speaker.sendInitialEmail,
    auth: true
  }
});
