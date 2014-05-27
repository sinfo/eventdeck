var server  = require('./../index.js').hapi;
var meeting = require('./../resources/meeting');

server.route({
  method: 'GET',
  path: '/api/meeting',
  config: {
    handler: meeting.list,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/meeting/{id}',
  config: {
    handler: meeting.get,
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

server.route({
  method: 'PUT',
  path: '/api/meeting/{id}',
  config: {
    handler: meeting.update,
    auth: true
  }
});

server.route({
  method: 'DELETE',
  path: '/api/meeting/{id}',
  config: {
    handler: meeting.delete,
    auth: true
  }
});
