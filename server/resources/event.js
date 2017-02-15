const Boom = require('boom')
const slug = require('slug')
const server = require('../index').hapi
const log = require('../helpers/logger')
const parser = require('../helpers/fieldsParser')
const eventModel = require('../db/event')
const dupKeyParser = require('../helpers/dupKeyParser')

server.method('event.create', create, {})
server.method('event.update', update, {})
server.method('event.get', get, {})
server.method('event.list', list, {})
server.method('event.remove', remove, {})

function create (event, memberId, cb) {
  event.id = slug(event.id || event.name).toLowerCase()
  event.updated = Date.now()

  eventModel.create(event, (err, _event) => {
    if (err) {
      if (err.code === 11000) {
        log.warn({err, requestedEvent: _event.id}, 'event is a duplicate')
        return cb(Boom.conflict(dupKeyParser(err.err) + ' is a duplicate'))
      }

      log.error({err: err, _event: _event}, 'error creating event')
      return cb(Boom.internal())
    }

    cb(null, _event)
  })
}

function update (id, event, cb) {
  event.updated = Date.now()

  eventModel.findOneAndUpdate({id: id}, event, {new: true}, function (err, _event) {
    if (err) {
      log.error({err, event: id}, 'error updating event')
      return cb(Boom.internal())
    }
    if (!_event) {
      log.warn({err: 'not found', event: id}, 'error updating event')
      return cb(Boom.notFound())
    }

    cb(null, _event)
  })
}

function get (id, query, cb) {
  cb = cb || query // fields is optional

  const fields = parser(query.fields)

  eventModel.findOne({id: id}, fields, (err, event) => {
    if (err) {
      log.error({err, event: id}, 'error getting event')
      return cb(Boom.internal())
    }
    if (!event) {
      log.warn({err: 'not found', event: id}, 'error getting event')
      return cb(Boom.notFound())
    }

    cb(null, event)
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

  eventModel.find({}, fields, options, (err, events) => {
    if (err) {
      log.error({err}, 'error getting all events')
      return cb(Boom.internal())
    }

    cb(null, events)
  })
}

function remove (id, cb) {
  eventModel.findOneAndRemove({id: id}, (err, event) => {
    if (err) {
      log.error({err, event: id}, 'error deleting event')
      return cb(Boom.internal())
    }
    if (!event) {
      log.error({err, event: id}, 'error deleting event')
      return cb(Boom.notFound())
    }

    return cb(null, event)
  })
}
