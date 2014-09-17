var Event = require('../../db/models/event');
var Notification = require('../../db/models/notification');
var log = require('../../helpers/logger');

module.exports = remove;

function remove(request, reply) {

  Event.del(request.params.id, function(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[event] error deleting event');
      return reply({error: 'There was an error deleting the event.'});
    }

    log.info({username: request.auth.credentials.id}, '[event] deleted the event %s', request.params.id);

    reply({success: 'Event deleted.'});
    
    Notification.removeByThread('event-'+request.params.id, function (err, result) {
      if(err) { 
        log.error({err: err, username: request.auth.credentials.id}, '[event] error deleting event notifications');
      }
    });
    
    Notification.removeBySource(request.params.id, function (err, result) {
      if(err) { 
        log.error({err: err, username: request.auth.credentials.id}, '[event] error deleting event notifications');
      }
    });
  });

}
