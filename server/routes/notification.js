var server       = require('./../index.js').hapi;
var notification = require('./../resources/notification');

server.route({
  method: 'GET',
  path: '/api/notification',
  config: {
    handler: notification.list,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/notification/{id}',
  config: {
    handler: notification.get,
    auth: true
  }
});

server.route({
  method: 'PUT',
  path: '/api/notification/{id}',
  config: {
    handler: notification.update,
    auth: true
  }
});
