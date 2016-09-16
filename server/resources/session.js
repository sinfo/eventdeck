var Boom = require('boom')
var slug = require('slug')
var server = require('server').hapi
var log = require('server/helpers/logger')
var parser = require('server/helpers/fieldsParser')
var Session = require('server/db/session')
var ical = require('server/helpers/ical')

server.method('session.create', create, {})
server.method('session.update', update, {})
server.method('session.get', get, {})
server.method('session.list', list, {})
server.method('session.remove', remove, {})
server.method('session.search', search, {})

function create (session, memberId, cb) {
  session.updated = Date.now()
  session.id = slug((session.id || session.name) + '-' + session.event).toLowerCase()

  Session.create(session, function (err, _session) {
    if (err) {
      log.error({err: err, session: session}, 'error creating session')
      return cb(Boom.internal())
    }

    ical.generate()

    cb(null, _session)
  })
}

function update (id, session, cb) {
  session.updated = Date.now()
  var filter = {id: id}
  Session.findOneAndUpdate(filter, session, function (err, _session) {
    if (err) {
      log.error({err: err, session: id}, 'error updating session')
      return cb(Boom.internal())
    }
    if (!_session) {
      log.warn({err: 'not found', session: id}, 'error updating session')
      return cb(Boom.notFound())
    }

    ical.generate()

    cb(null, _session)
  })
}

function get (id, query, cb) {
  cb = cb || query
  var filter = {id: id}
  var fields = query.fields

  Session.findOne(filter, fields, function (err, session) {
    if (err) {
      log.error({err: err, session: id}, 'error getting session')
      return cb(Boom.internal())
    }
    if (!session) {
      log.warn({err: 'not found', session: id}, 'error getting session')
      return cb(Boom.notFound())
    }

    cb(null, session)
  })
}

function list (query, cb) {
  cb = cb || query
  var filter = {}
  var fields = query.fields
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  if (query.event) { filter.event = query.event }

  Session.find(filter, fields, options, function (err, sessions) {
    if (err) {
      log.error({err: err}, 'error getting all sessions')
      return cb(Boom.internal())
    }

    cb(null, sessions)
  })
}

function remove (id, cb) {
  var filter = {id: id}
  Session.findOneAndRemove(filter, function (err, session) {
    if (err) {
      log.error({err: err, session: id}, 'error deleting session')
      return cb(Boom.internal())
    }
    if (!session) {
      log.error({err: err, session: id}, 'error deleting session')
      return cb(Boom.notFound())
    }

    ical.generate()

    return cb(null, session)
  })
}

function search (str, query, cb) {
  cb = cb || query // fields is optional

  var filter = { name: new RegExp(str, 'i') }
  var fields = parser(query.fields || 'id,name,img')
  var options = {
    skip: query.skip,
    limit: query.limit || 10,
    sort: parser(query.sort)
  }

  Session.find(filter, fields, options, function (err, exactSessions) {
    if (err) {
      log.error({err: err, filter: filter}, 'error getting sessions')
      return cb(Boom.internal())
    }

    if (exactSessions.length > 0) {
      return cb(null, { exact: exactSessions })
    }

    filter = {
      $or: [
        { kind: new RegExp(str, 'i') },
        { place: new RegExp(str, 'i') },
        { description: new RegExp(str, 'i') }
      ]
    }

    Session.find(filter, fields, options, function (err, extendedSessions) {
      if (err) {
        log.error({err: err, filter: filter}, 'error getting sessions')
        return cb(Boom.internal())
      }

      return cb(null, { exact: exactSessions, extended: extendedSessions })
    })
  })
}
