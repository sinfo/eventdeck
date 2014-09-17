var Session = require('../../db/models/session');
var notification  = require('../notification');
var log = require('../../helpers/logger');

module.exports = create;

function create(request, reply) {

  var session = request.payload;

  session.member = request.auth.credentials.id;

  var newSession = new Session(session);

  newSession.save(function (err){
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, session: newSession}, '[session] error creating new session');
      return reply({error: 'Error creating session.'});
    }

    log.info({username: request.auth.credentials.id, session: newSession.id || newSession._id}, '[session] new session created');
    notification.notify(request.auth.credentials.id, 'session-'+session.id, 'created a new session', null);

    reply({success: 'Session created.'});
  });

}
