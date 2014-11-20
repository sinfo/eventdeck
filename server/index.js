var Hapi = require('hapi');
var SocketIO = {server: require('socket.io'), client: require('socket.io-client')};
var log = require('server/helpers/logger');
var config = require('config');
var cookieConfig = config.cookie;
var moonbootsConfig = require('moonbootsConfig');

log.error('### Starting EventDeck ###');

var server = module.exports.hapi = new Hapi.Server(config.port);

require('./db');

var internals = {};
// set clientconfig cookie
internals.configStateConfig = {
    encoding: 'none',
    ttl: 1000 * 60 * 15,
    isSecure: config.isSecure
};

server.state('config', internals.configStateConfig);
internals.clientConfig = JSON.stringify(config.client);
server.ext('onPreResponse', function(request, reply) {
  if (!request.state.config && !request.response.isBoom) {
    var response = request.response;
    return reply(response.state('config', encodeURIComponent(internals.clientConfig)));
  }

  return reply();
});

server.pack.register([
    { plugin: require('hapi-swagger'), options: config.swagger },
    { plugin: require('moonboots_hapi'), options: moonbootsConfig },
    require('hapi-auth-cookie'),
    { plugin: require('./plugins/images'), options: config.images },
  ],
  function (err) {

  server.auth.strategy('session', 'cookie', {
    cookie: cookieConfig.name,
    password: cookieConfig.password,
    ttl: 2592000000,
/*  appendNext: true,
    redirectTo: '/login',
    redirectOnTry: true,
    isSecure: false,
    isHttpOnly: false,*/
    isSecure: false,
  });

  var webSocket = module.exports.webSocket = {
    server: SocketIO.server.listen(server.listener)
  };
  log.info('Websocket server started at: ' + server.info.uri);
  require('./sockets');
  webSocket.client = module.exports.webSocket.client = SocketIO.client.connect('http://localhost:' + server.info.port);

  require('./resources');
  require('./routes');

  if (!module.parent) {
    server.start(function () {
      log.info('Server started at: ' + server.info.uri);
      // var crono  = require('./scripts/crono');
      // var reminders = require('./resources/reminder');
      // reminders(null, function(stuff){});
      // crono.reminder.start();
    });
  }
});
