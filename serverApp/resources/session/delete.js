var Session = require('../../db/models/session');
var Notification = require('../../db/models/notification');
var log = require('../../helpers/logger');

module.exports = remove;

function remove(request, reply) {

  Session.del(request.params.id, function(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, session: request.params.id}, '[session] error deleting session');
      return reply({error: 'There was an error deleting the session.'});
    }

    log.info({username: request.auth.credentials.id, session: request.params.id}, '[session] deleted the session');
    reply({success: 'Session deleted.'});
    
    Notification.removeByThread('session-'+request.params.id, function (err) {
      if(err) { 
        log.error({err: err, username: request.auth.credentials.id, session: request.params.id}, '[session] error deleting session notifications');
      }
    });
    
    Notification.removeBySource(request.params.id, function (err) {
      if(err) { 
        log.error({err: err, username: request.auth.credentials.id, session: request.params.id}, '[session] error deleting session notifications');
      }
    });
  });

}
