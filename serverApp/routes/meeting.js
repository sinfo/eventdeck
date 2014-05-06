var server  = require('./../index.js');
var meeting = require('./../resources/meeting');

server.route({
  method: 'GET',
  path: '/api/meetings',
  config: {
    handler: meeting.list,
    auth: true
  }
});

server.route({
  method: 'POST',
  path: '/api/meeting',
  config: {
    handler: meeting.create,
    auth: true
  }
});
