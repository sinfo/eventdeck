var async    = require('async');
var Session  = require('./../../db/models/session.js');

module.exports = create;

function create(request, reply) {

  var session = request.payload;

  var savedSession;

  async.series([
    getSession,
    saveSession
  ], done);

  function getSession(cb) {
    Session.findById(request.params.id, gotSession);

    function gotSession(err, result) {
      if (!err && result && result.length > 0) {
        savedSession = result[0];
        session.updated = Date.now();
        cb();
      }
      else {
        cb(err);
      }
    }
  }

  function saveSession(cb) {
    Session.update({_id: request.params.id}, session, function(err) {
      if (err) {
        cb(err);
      }
      else {
        cb();
      }
    });
  }

  function done(err) {
    if (err) {
      reply({error: "There was an error updating the session."});
    }
    else {
      reply({success: "Session updated."});
    }
  }
}
