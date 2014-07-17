var server = require('./../index.js').hapi;
var reminder = require('./../resources/reminder');

server.route({
  method: 'PUT',
  path: '/api/reminder',
  config: {
    handler: reminder,
    auth: true
  }
});
