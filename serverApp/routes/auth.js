var server = require('./../index.js').hapi;
var auth   = require('./../resources/auth');

server.route({
  method: 'GET',
  path: '/api/login',
  config: {
    handler: auth.login,
    auth: {
      mode: 'try'
    }
  }
});

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
  path: '/api/logout',
  config: {
    handler: auth.logout,
    auth: true
  }
});
