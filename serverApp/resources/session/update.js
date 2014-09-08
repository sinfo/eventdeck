var async    = require('async');
var Session  = require('../../db/models/session');
var notification  = require('../notification');

module.exports = update;

function update(request, reply) {

  var session = request.payload;

  var savedSession;

  async.series([
    getSession,
    saveSession
  ], done);

  function getSession(cb) {
    Session.findById(request.params.id, gotSession);

    function gotSession(err, result) {
      if (err || !result || result.length < 1) {
        return cb(err || 'Couldn\'t find any session');
      }

      savedSession = result[0];
      session.updated = Date.now();
      cb();
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
      return reply({error: 'There was an error updating the session.'});
    }

    notification.notify(request.auth.credentials.id, 'session-'+session.id, 'updated a session', null);

    reply({success: 'Session updated.'});
  }
}
