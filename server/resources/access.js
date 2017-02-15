const Boom = require('boom')
const server = require('../index').hapi
const log = require('../helpers/logger')
const threadFromPath = require('../helpers/threadFromPath')
const Access = require('../db/access')

server.method('access.save', save, {})
server.method('access.get', get, {})

function save (memberId, path, id, cb) {
  let thread = ''
  if (typeof (id) === 'function') {
    thread = path
    cb = id
  } else {
    thread = threadFromPath(path, id)
  }

  const filter = { member: memberId, thread }
  const access = {
    member: memberId,
    thread,
    last: Date.now()
  }

  Access.findOneAndUpdate(filter, access, {upsert: true}, (err, savedAccess) => {
    if (err) {
      log.error({err, access})
      return cb(Boom.internal())
    }

    return cb(null, savedAccess)
  })
}

function get (memberId, path, id, cb) {
  let thread = ''
  if (typeof (id) === 'function') {
    thread = path
    cb = id
  } else {
    thread = threadFromPath(path, id)
  }

  const filter = { member: memberId, thread }

  Access.findOne(filter, (err, savedAccess) => {
    if (err) {
      log.error({err, access: filter})
      return cb(Boom.internal())
    }

    return cb(null, savedAccess)
  })
}
