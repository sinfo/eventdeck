var server       = require('./../index.js');
var notification = require('./../resources/notification');

server.route({
  method: 'GET',
  path: '/api/notifications',
  config: {
    handler: notification.list,
    auth: true
  }
});
