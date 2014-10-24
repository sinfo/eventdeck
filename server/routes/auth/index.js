var server = require('server').hapi;
var handlers = require('./handlers');


// server.route({
//   method: 'GET',
//   path: '/login/facebook',
//   config: handlers.facebook
// });

server.route({
  method: 'GET',
  path: '/auth/login/{id}',
  config: handlers.createCode
});

server.route({
  method: 'GET',
  path: '/auth/login/{id}/{code}',
  config: handlers.loginWithCode
});

server.route({
  method: 'GET',
  path: '/auth/logout',
  config: handlers.logout
});
