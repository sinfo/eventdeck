var server  = require('./../index.js');
var meeting = require('./../resources/topic');

server.route({
  method: 'GET',
  path: '/api/topics',
  config: {
    handler: meeting.list,
    auth: true
  }
});

server.route({
  method: 'POST',
  path: '/api/topics',
  config: {
    handler: meeting.create,
    auth: true
  }
});

server.route({
  method: 'PUT',
  path: '/api/topics',
  config: {
    handler: meeting.update,
    auth: true
  }
});
