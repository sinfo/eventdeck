var server = require('./../index.js').hapi;
var auth   = require('./../resources/auth');

server.route({
  method: 'GET',
  path: '/api/login/facebook',
  config: {
    handler: auth.facebook,
    auth: {
      mode: 'try'
    }
  }
});

server.route({
  method: 'GET',
  path: '/api/login/{id}',
  config: {
    handler: auth.email,
    auth: {
      mode: 'try'
    }
  }
});

server.route({
  method: 'GET',
  path: '/api/login/{id}/{code}',
  config: {
    handler: auth.loginCode,
    auth: {
      mode: 'try'
    }
  }
});

server.route({
  method: 'GET',
  path: '/api/logout',
  config: {
    handler: auth.logout,
    auth: true
  }
});
