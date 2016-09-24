var Boom = require('boom')
var server = require('../index').hapi

server.method('authorization.isAdmin', isAdmin, {})

function isAdmin (member, cb) {
  var isAuthorized = member.participations.filter(function (participation) {
    return participation.role === 'coordination'
  }).length > 0

  if (!isAuthorized) {
    return cb(Boom.unauthorized("You don't have permissions for this"))
  }

  return cb()
}
