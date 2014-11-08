var Boom = require('boom');
var server = require('server').hapi;
var log = require('server/helpers/logger');


server.method('authorization.isAdmin', isAdmin, {});


function isAdmin(member, cb) {
  var isAuthorized = member.roles.filter(function (role) {
    return role.id === 'development-team' || role.id === 'coordination';
  }).length > 0;

  if(!isAuthorized) {
    return cb(Boom.unauthorized('You don\'t have permissions for this'));
  }

  return cb();
}