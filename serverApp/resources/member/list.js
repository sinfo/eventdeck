var async          = require('async');
var Member        = require('./../../db/models/member.js');
var Hapi           = require('hapi');

module.exports = list;

function list(request, reply) {

  var members;

  async.series([
      getMembers,
    ], done);

  function getMembers(cb) {
    Member.findAll(gotMembers);

    function gotMembers(err, result) {
      if (err) cb(err);
      members = result;
      cb();
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(members);
    }
  }
}