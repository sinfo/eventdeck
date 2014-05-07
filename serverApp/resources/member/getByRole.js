var Hapi           = require('hapi');
var async          = require('async');
var Member        = require('./../../db/models/member.js');

exports = module.exports = get;

/// get member

function get(request, reply) {

  var roleId = request.params.id;
  var members   = [];

  async.series([
      getMembers,
    ], done);

  function getMembers(cb) {
    Member.findByRole(roleId, gotMembers);

    function gotMembers(err, result) {
      if (err) {
        cb(err);
      }

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
