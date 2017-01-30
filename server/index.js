// init http monitoring
require('pmx').init()

const Hapi = require('hapi')
const Vision = require('vision')
const IO = {server: require('socket.io'), client: require('socket.io-client')}
const log = require('./helpers/logger')
const config = require('../config')
const path = require('path')
const cookieConfig = config.cookie
const moonbootsConfig = require('../moonbootsConfig')

const cookieName = 'eventdeck-config'

log.info({env: process.env.NODE_ENV}, '### Starting EventDeck ###')

const server = module.exports.hapi = new Hapi.Server()
server.connection({
  host: config.host,
  port: config.port
  // TODO: CORS in new Hapi version is disabled - it's needed ?
  // { cors: config.cors }
})

require('./db')

let internals = {}
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
    let response = request.response
    return reply(response.state(cookieName, encodeURIComponent(internals.clientConfig)))
  }

  return reply()
})

// Set view template engine
server.register(Vision, (err) => {
  if (err) throw err

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    path: path.join(__dirname, 'templates')
  })
})

server.register([
    {register: require('hapi-swagger'), options: config.swagger},
    {register: require('moonboots_hapi'), options: moonbootsConfig},
    {register: require('hapi-auth-cookie')},
    {register: require('./plugins/images'), options: config.images},
    {register: require('./plugins/templates'), options: config.templates},
    {register: require('inert')} ],
  (err) => {
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

    let webSocket = {}
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
