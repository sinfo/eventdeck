var server = require('server').hapi;
var handlers = require('./handlers');

require('./methods');


// server.route({
//   method: 'GET',
//   path: '/api/login/facebook',
//   config: handlers.facebook
// });

server.route({
  method: 'GET',
  path: '/api/login/{id}',
  config: handlers.createCode
});

server.route({
  method: 'GET',
  path: '/api/login/{id}/{code}',
  config: handlers.loginWithCode
});

server.route({
  method: 'GET',
  path: '/api/logout',
  config: handlers.logout
});
