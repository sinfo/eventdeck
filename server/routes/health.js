var server = require('../index').hapi

server.route({
  method: 'GET',
  path: '/health',
  handler: function (request, reply) {
    reply('OK')
  }
})
