const Boom = require('boom')
const server = require('../index').hapi
const log = require('../helpers/logger')
const parser = require('../helpers/fieldsParser')
const Message = require('../db/message')

server.method('message.create', create, {})
server.method('message.get', get, {})
server.method('message.list', list, {})
server.method('message.getByChat', getByChat, {})

function create (message, cb) {
  Message.create(message, (err, _message) => {
    if (err) {
      log.error({err, message}, 'error creating message')
      return cb(Boom.internal())
    }

    cb(null, _message)
  })
}

function get (id, query, cb) {
  cb = cb || query // fields is optional
  const fields = parser(query.fields)

  Message.findOne({id: id}, fields, (err, message) => {
    if (err) {
      log.error({err, message: id}, 'error getting message')
      return cb(Boom.internal())
    }
    if (!message) {
      log.warn({err: 'not found', message: id}, 'error getting message')
      return cb(Boom.notFound())
    }

    cb(null, message)
  })
}

function getByChat (chatId, query, cb) {
  cb = cb || query

  const fields = parser(query.fields)
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }

  Message.find({chatId: chatId}, fields, options, (err, messages) => {
    if (err) {
      log.error({err, chat: chatId}, 'error getting messages')
      return cb(Boom.internal())
    }
    cb(null, messages)
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
  Message.find({}, fields, options, (err, messages) => {
    if (err) {
      log.error({err}, 'error getting all messages')
      return cb(Boom.internal())
    }

    cb(null, messages)
  })
}
