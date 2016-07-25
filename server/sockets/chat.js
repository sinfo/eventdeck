var async = require('async')
var server = require('server')
var log = require('server/helpers/logger')
var IO = server.socket.server

function chatServer (socket) {
  socket.on('chat-init', function (data, cbClient) {
    var room = data.chatId
    var user = socket.nickname
    server.methhods.chat.get(room, function (err, chat) {
      if (err) {
        log.error({err: err, chat: chat.id, user: user}, '[socket-chat] error on initialization')
        return cbClient(err)
      }
      var online = []
      socket.join(room)
      var clients = IO.sockets
      for (var i = 0; i < clients.length; i++) {
        if (clients[i].connected && clients[i].nickname) {
          online[i] = clients[i].nickname
        }
      }
      var data = {
        room: room,
        chatData: chat,
        online: online
      }
      IO.in(room).emit('user-connected', {id: socket.nickname})
      socket.emit('chat-init-response', data)
      cbClient()
    })
  })

  socket.on('chat-send', function (data, cbClient) {
    var room = data.room
    var messageData = data.message
    async.waterfall([
      function (cb) {
        server.methods.message.create(messageData, cb)
      },
      function (cb, message) {
        server.methods.chat.message.add(room, message.id, cb)
      }
    ], function (err, results) {
      if (err) {
        log.error({err: err, chat: room}, '[socket-chat] error on chat send')
        return cbClient(err)
      }
      IO.in(room).emit('message', {message: results[0]})
      cbClient()
    })
  })

  socket.on('chat-logout', function (data, cb) {
    IO.in(data.room).emit('user-disconnected', {id: socket.nickname})
    log.debug({user: socket.nickname}, '[socket-chat] User disconnected')
    socket.disconnect()
    cb()
  })

  socket.on('chat-get', function (data, cb) {
    var page = data.page
    var room = data.room
    server.methods.message.getByChat(room, {skip: 10 * page, limit: 10, sort: 'date'}, function (err, messages) {
      if (err) {
        log.error({err: err, chat: room}, '[socket-chat] error on page send')
        return cb(err)
      }
      IO.in(room).emit('chat-get-response', {messages: messages})
      cb()
    })
  })
}

module.exports = chatServer
