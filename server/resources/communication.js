var Boom = require('boom')
var server = require('../index').hapi
var log = require('../helpers/logger')
var threadFromPath = require('../helpers/threadFromPath')
var parser = require('../helpers/fieldsParser')
var Communication = require('../db/communication')

server.method('communication.create', create, {})
server.method('communication.update', update, {})
server.method('communication.get', get, {})
server.method('communication.getByMember', getByMember, {})
server.method('communication.getByThread', getByThread, {})
server.method('communication.getByEvent', getByEvent, {})
server.method('communication.list', list, {})
server.method('communication.remove', remove, {})
server.method('communication.removeByThread', removeByThread, {})

function create (communication, memberId, cb) {
  communication.status = 'pending-review'
  communication.member = memberId
  communication.posted = Date.now()
  communication.updated = Date.now()

  Communication.create(communication, function (err, _communication) {
    if (err) {
      log.error({err: err, communication: communication}, 'error creating communication')
      return cb(Boom.internal())
    }

    cb(null, _communication)
  })
}

function update (id, communication, cb) {
  communication.updated = Date.now()
  var filter = {_id: id}
  Communication.findOneAndUpdate(filter, communication, {new: true}, function (err, _communication) {
    if (err) {
      log.error({err: err, communication: id}, 'error updating communication')
      return cb(Boom.internal())
    }
    if (!_communication) {
      log.warn({err: 'not found', communication: id}, 'error updating communication')
      return cb(Boom.notFound())
    }

    cb(null, _communication)
  })
}

function get (id, query, cb) {
  cb = cb || query // fields is optional

  var filter = {_id: id}
  var fields = parser(query.fields)

  Communication.findOne(filter, fields, function (err, communication) {
    if (err) {
      log.error({err: err, communication: id}, 'error getting communication')
      return cb(Boom.internal())
    }
    if (!communication) {
      log.warn({err: 'not found', communication: id}, 'error getting communication')
      return cb(Boom.notFound())
    }

    cb(null, communication)
  })
}

function getByMember (memberId, query, cb) {
  cb = cb || query // fields is optional

  var filter = {member: memberId}
  var fields = parser(query.fields)
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Communication.find(filter, fields, options, function (err, communications) {
    if (err) {
      log.error({err: err, member: memberId}, 'error getting communications')
      return cb(Boom.internal())
    }

    cb(null, communications)
  })
}

function getByThread (path, id, query, cb) {
  cb = cb || query // fields is optional

  var thread = threadFromPath(path, id)
  var filter = {thread: thread}
  Communication.find(filter, function (err, communications) {
    if (err) {
      log.error({err: err, thread: thread}, 'error getting communications')
      return cb(Boom.internal())
    }

    cb(null, communications)
  })
}

function getByEvent (eventId, query, cb) {
  cb = cb || query // fields is optional

  var filter = {event: eventId}
  Communication.find(filter, function (err, communications) {
    if (err) {
      log.error({err: err, event: eventId}, 'error getting communications')
      return cb(Boom.internal())
    }

    cb(null, communications)
  })
}

function list (query, cb) {
  cb = cb || query // fields is optional

  var filter = {}
  if (query.status) { filter.status = query.status }
  if (query.member) { filter.member = query.member }
  if (query.kind) { filter.kind = query.kind }
  if (query.event) { filter.event = query.event }

  var fields = parser(query.fields)
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Communication.find(filter, fields, options, function (err, communications) {
    if (err) {
      log.error({err: err}, 'error getting all communications')
      return cb(Boom.internal())
    }

    cb(null, communications)
  })
}

function remove (id, cb) {
  var filter = {_id: id}
  Communication.findOneAndRemove(filter, function (err, communication) {
    if (err) {
      log.error({err: err, communication: id}, 'error deleting communication')
      return cb(Boom.internal())
    }
    if (!communication) {
      log.warn({err: 'not found', communication: id}, 'error removing communication')
      return cb(Boom.notFound())
    }

    return cb(null, communication)
  })
}

function removeByThread (path, id, cb) {
  var thread = ''
  if (typeof (id) === 'function') {
    thread = path
    cb = id
  } else {
    thread = threadFromPath(path, id)
  }

  var filter = {thread: thread}
  Communication.remove(filter, function (err, communications) {
    if (err) {
      log.error({err: err, thread: thread}, 'error getting communications')
      return cb(Boom.internal())
    }

    cb(null, communications)
  })
}
