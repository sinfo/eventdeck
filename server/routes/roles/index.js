const server = require('../../index').hapi
const handlers = require('./handlers')

server.route({
  method: 'GET',
  path: '/api/roles',
  config: handlers.list
})
