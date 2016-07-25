/*global app*/
var io = require('ampersand-io')
var log = require('bows')('io-app')

module.exports = io.extend({
  events: {
    init: 'init',
    onConnected: 'connect',
    onDisconnected: 'disconnect',
    onReconnecting: 'reconnecting',
    onReconnected: 'reconnect',
    onReconnectFail: 'reconnect_failed',
    onReconnectionErr: 'reconnect_error',
    onConnectionErr: 'error'
  },
  listeners: {
    onConnected: {
      fn: function () {
        log('Connected!')
        app.me.online = true
        app.me.error = false
      }
    },

    onDisconnected: {
      fn: function () {
        log('Disconnected!')
        app.me.online = false
      }
    },

    onReconnecting: {
      fn: function (attempts) {
        log('Reconnecting')
        app.me.reconnecting = true
      }
    },

    onReconnected: {
      fn: function (attempts) {
        log('Reconnected')
        app.me.reconnecting = false
        app.socket.init()
      }
    },

    onReconnectFail: {
      fn: function () {
        log('Reconnect failed')
        app.me.reconnecting = false
      }
    },

    onReconnectionErr: {
      fn: function (error) {
        log('Reconnection error', error)
        app.me.error = true
      }
    },

    onConnectionErr: {
      fn: function (error) {
        log('Connection error', error)
        app.me.error = true
      }
    }
  },
  init: function () {
    var callback = function (err) {
      if (err) {
        log(err)
      }
    }

    this.emit(this.events.init, app.me, function (err) {
      if (err) {
        return callback(err)
      }
      app.notifications.private.emit(app.notifications.private.events.count, {id: app.me.id}, callback)
    })
  }
})
