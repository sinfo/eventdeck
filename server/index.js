// init http monitoring
require('pmx').init()

var Hapi = require('hapi')
var IO = {server: require('socket.io'), client: require('socket.io-client')}
var log = require('./helpers/logger')
var config = require('../config')
var path = require('path')
var cookieConfig = config.cookie
var moonbootsConfig = require('../moonbootsConfig')

var cookieName = 'eventdeck-config'

log.error({ env: process.env.NODE_ENV }, '### Starting EventDeck ###')

var server = module.exports.hapi = new Hapi.Server(config.host, config.port, { cors: config.cors })

require('./db')

var internals = {}
// set clientconfig cookie
internals.configStateConfig = {
  encoding: 'none',
  ttl: 1000 * 60 * 15,
  isSecure: config.isSecure
}

server.state(cookieName, internals.configStateConfig)
internals.clientConfig = JSON.stringify(config.client)
server.ext('onPreResponse', function (request, reply) {
  if (!request.state.config && !request.response.isBoom) {
    var response = request.response
    return reply(response.state(cookieName, encodeURIComponent(internals.clientConfig)))
  }

  return reply()
})

// Set view template engine
server.views({
  engines: {
    hbs: require('handlebars')
  },
  path: path.join(__dirname, 'templates')
})

server.pack.register([
  { plugin: require('hapi-swagger'), options: config.swagger },
  { plugin: require('moonboots_hapi'), options: moonbootsConfig },
  require('hapi-auth-cookie'),
  { plugin: require('./plugins/images'), options: config.images },
  { plugin: require('./plugins/templates'), options: config.templates }
],
  function (err) {
    if (err) throw err

    server.auth.strategy('session', 'cookie', {
      cookie: cookieConfig.name,
      password: cookieConfig.password,
      ttl: 2592000000,
      /* appendNext: true,
        redirectTo: '/login',
        redirectOnTry: true,
        isSecure: false,
        isHttpOnly: false, */
      isSecure: false
    })

    var webSocket = {}
    webSocket.server = IO.server.listen(server.listener)
    log.info('Websocket server started at: ' + server.info.uri)
    webSocket.client = IO.client('http://localhost:' + server.info.port)
    module.exports.socket = webSocket
    require('./sockets')
    webSocket.client.emit('init', {data: {id: 'toolbot'}}, function () {
      log.info('Websocket client listeners set')
    })

    require('./resources')
    require('./routes')

    if (!module.parent) {
      server.start(function () {
        log.info('Server started at: ' + server.info.uri)
      // var crono  = require('./scripts/crono')
      // var reminders = require('./resources/reminder')
      // reminders(null, function(stuff){})
      // crono.reminder.start()
      })
    }
  }
)
