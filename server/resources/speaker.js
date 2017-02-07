const Boom = require('boom')
const slug = require('slug')
const server = require('../index').hapi
const log = require('../helpers/logger')
const parser = require('../helpers/fieldsParser')
const Speaker = require('../db/speaker')
const dupKeyParser = require('../helpers/dupKeyParser')

server.method('speaker.create', create, {})
server.method('speaker.update', update, {})
server.method('speaker.get', get, {})
server.method('speaker.getByMember', getByMember, {})
server.method('speaker.getByEvent', getByEvent, {})
server.method('speaker.list', list, {})
server.method('speaker.remove', remove, {})
server.method('speaker.search', search, {})

function create (speaker, memberId, cb) {
  speaker.id = slug(speaker.id || speaker.name).toLowerCase()
  speaker.updated = Date.now()

  Speaker.create(speaker, (err, _speaker) => {
    if (err) {
      if (err.code === 11000) {
        log.warn({err, requestedSpeaker: speaker.id}, 'speaker is a duplicate')
        return cb(Boom.conflict(dupKeyParser(err.err) + ' is a duplicate'))
      }

      log.error({err, speaker: speaker}, 'error creating speaker')
      return cb(Boom.internal())
    }
    cb(null, _speaker.toObject({ getters: true }))
  })
}

function update (id, speaker, cb) {
  speaker.updated = Date.now()
  Speaker.findOneAndUpdate({id: id}, speaker, {new: true}, (err, _speaker) => {
    if (err) {
      log.error({err, speaker: id}, 'error updating speaker')
      return cb(Boom.internal())
    }
    if (!_speaker) {
      log.warn({err: 'not found', speaker: id}, 'error updating speaker')
      return cb(Boom.notFound())
    }

    cb(null, _speaker)
  })
}

function get (id, query, cb) {
  cb = cb || query // fields is optional

  const fields = parser(query.fields)
  Speaker.findOne({id: id}, fields, function (err, speaker) {
    if (err) {
      log.error({err, speaker: id}, 'error getting speaker')
      return cb(Boom.internal())
    }
    if (!speaker) {
      log.warn({err: 'not found', speaker: id}, 'error getting speaker')
      return cb(Boom.notFound())
    }

    cb(null, speaker)
  })
}

function getByMember (memberId, query, cb) {
  cb = cb || query
  const filter = { participations: { $elemMatch: { member: memberId } } }
  const fields = query.fields
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Speaker.find(filter, fields, options, (err, speaker) => {
    if (err) {
      log.error({err, member: memberId}, 'error getting speaker')
      return cb(Boom.internal())
    }

    cb(null, speaker)
  })
}

function getByEvent (eventId, query, cb) {
  cb = cb || query
  const filter = { participations: { $elemMatch: { event: eventId } } }
  const fields = query.fields
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Speaker.find(filter, fields, options, (err, speaker) => {
    if (err) {
      log.error({err, event: eventId}, 'error getting speaker')
    }

    cb(null, speaker)
  })
}

function list (query, cb) {
  cb = cb || query
  let eventsFilter = {}
  let filter = {}
  const fields = parser(query.fields)
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort),
    random_sample: Math.floor((Math.random() * 50) + 1)
  }

  if (typeof query.member !== 'undefined') {
    if (query.member === false) {
      query.member = { $exists: false }
    }
    eventsFilter.member = query.member
  }
  if (query.event) {
    eventsFilter.event = query.event
  }

  if (eventsFilter.event || eventsFilter.member) {
    filter.participations = query.participations ? {$elemMatch: eventsFilter} : {$not: {$elemMatch: eventsFilter}}
  }

  Speaker.find(filter, fields, options, (err, speaker) => {
    if (err) {
      log.error({err}, 'error getting all speaker')
      return cb(Boom.internal())
    }

    cb(null, speaker)
  })
}

function remove (id, cb) {
  Speaker.findOneAndRemove({id: id}, (err, speaker) => {
    if (err) {
      log.error({err: err, speaker: id}, 'error deleting speaker')
      return cb(Boom.internal())
    }
    if (!speaker) {
      log.error({err, speaker: id}, 'error deleting speaker')
      return cb(Boom.notFound())
    }

    return cb(null, speaker)
  })
}

function search (str, query, cb) {
  cb = cb || query // fields is optional

  let filter = { name: new RegExp(str, 'i') }
  const fields = parser(query.fields || 'id,name,img')
  const options = {
    skip: query.skip,
    limit: query.limit || 10,
    sort: parser(query.sort)
  }

  Speaker.find(filter, fields, options, (err, exactSpeakers) => {
    if (err) {
      log.error({err, filter}, 'error getting speakers')
      return cb(Boom.internal())
    }

    if (exactSpeakers.length > 0) {
      return cb(null, { exact: exactSpeakers })
    }

    filter = {
      $or: [
        { contacts: new RegExp(str, 'i') },
        { area: new RegExp(str, 'i') },
        { information: new RegExp(str, 'i') },
        { 'participations.status': new RegExp(str, 'i') }
      ]
    }

    Speaker.find(filter, fields, options, (err, extendedSpeakers) => {
      if (err) {
        log.error({err, filter}, 'error getting speakers')
        return cb(Boom.internal())
      }

      return cb(null, { exact: exactSpeakers, extended: extendedSpeakers })
    })
  })
}
