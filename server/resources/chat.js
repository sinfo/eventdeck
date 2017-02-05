const Boom = require('boom')
const server = require('../index').hapi
const log = require('../helpers/logger')
const parser = require('../helpers/fieldsParser')
const Chat = require('../db/chat')

server.method('chat.create', create, {})
server.method('chat.update', update, {})
server.method('chat.get', get, {})
server.method('chat.list', list, {})
server.method('chat.remove', remove, {})
server.method('chat.message.add', addMessage, {})
server.method('chat.message.remove', removeMessage, {})

function create (chat, cb) {
  Chat.create(chat, function (err, _chat) {
    if (err) {
      log.error({err: err, chat: chat}, 'error creating chat')
      return cb(Boom.internal())
    }

    cb(null, _chat)
  })
}

function update (id, chat, cb) {
  Chat.findOneAndUpdate({id: id}, chat, (err, _chat) => {
    if (err) {
      log.error({err: err, chat: id}, 'error updating chat')
      return cb(Boom.internal())
    }
    if (!_chat) {
      log.warn({err: 'not found', chat: id}, 'error updating chat')
      return cb(Boom.notFound())
    }

    cb(null, _chat)
  })
}

function get (id, query, cb) {
  cb = cb || query
  const fields = parser(query.fields)

  Chat.findOne({id: id}, fields, (err, chat) => {
    if (err) {
      log.error({err: err, chat: id}, 'error getting chat')
      return cb(Boom.internal())
    }
    if (!chat) {
      log.warn({err: 'not found', chat: id}, 'error getting chat')
      return cb(Boom.notFound())
    }

    cb(null, chat)
  })
}

function list (query, cb) {
  cb = cb || query // fields is optional

  const fields = parser(query.fields)
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Chat.find({}, fields, options, (err, chats) => {
    if (err) {
      log.error({err: err}, 'error getting all chats')
      return cb(Boom.internal())
    }

    cb(null, chats)
  })
}

function remove (id, cb) {
  Chat.findOneAndRemove({id: id}, (err, chat) => {
    if (err) {
      log.error({err: err, chat: id}, 'error deleting chat')
      return cb(Boom.internal())
    }
    if (!chat) {
      log.warn({err: 'not found', chat: id}, 'error removing chat')
      return cb(Boom.notFound())
    }

    return cb(null, chat)
  })
}

function addMessage (id, message, cb) {
  const update = {$push: {messages: message}}
  Chat.findOneAndUpdate({id: id}, update, (err, chat) => {
    if (err) {
      log.error({err: err, chat: id}, 'error adding chat message')
      return cb(Boom.internal())
    }
    if (!chat) {
      log.warn({err: 'not found', chat: id}, 'error adding message to chat')
      return cb(Boom.notFound())
    }

    return cb(null, chat)
  })
}

function removeMessage (id, message, cb) {
  const update = {$pull: {messages: message}}
  Chat.findOneAndUpdate({id: id}, update, (err, chat) => {
    if (err) {
      log.error({err: err, chat: id}, 'error removing chat message')
      return cb(Boom.internal())
    }
    if (!chat) {
      log.warn({err: 'not found', chat: id}, 'error removing message from chat')
      return cb(Boom.notFound())
    }

    return cb(null, chat)
  })
}
