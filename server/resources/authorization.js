const Boom = require('boom')
const server = require('../index').hapi

server.method('authorization.isAdmin', isAdmin, {})

function isAdmin (member, cb) {
  let isAuthorized = member.participations.filter((participation) => {
    return participation.role === 'coordination'
  }).length > 0

  if (!isAuthorized) {
    return cb(Boom.unauthorized("You don't have permissions for this"))
  }

  return cb()
}
