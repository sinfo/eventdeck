const server = require('../../index').hapi
const handlers = require('./handlers')

server.route({
  method: 'GET',
  path: '/api/auth/login/{id}',
  config: handlers.createCode
})

server.route({
  method: 'GET',
  path: '/api/auth/login/{id}/{code}',
  config: handlers.loginWithCode
})

server.route({
  method: 'GET',
  path: '/api/auth/facebook/{id}/{token}',
  config: handlers.loginWithFacebook
})

server.route({
  method: 'GET',
  path: '/api/auth/logout',
  config: handlers.logout
})
