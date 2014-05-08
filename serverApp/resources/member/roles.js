var async          = require('async');
var Member        = require('./../../db/models/member.js');
var Hapi           = require('hapi');

module.exports = list;

function list(request, reply) {

  var roles;

  async.series([
      getRoles,
    ], done);

  function getRoles(cb) {
    Member.findAllRoles(gotRoles);

    function gotRoles(err, result) {
      if (err) cb(err);
      roles = result;
      cb();
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(roles);
    }
  }
}