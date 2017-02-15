const server = require('../../index').hapi
const socketServer = require('../../index').socket.server

server.route({
  method: 'GET',
  path: '/api/test/notify',
  handler: function (request, reply) {
    server.methods.notification.notifyCreate('francisco.dias', '/companies', {id: 'ericsson'}, function (err, result) {
      if (err) return reply(err)
      socketServer.emit('notify-target', result)
      reply('testing-socket-notify')
    })
  }
})
