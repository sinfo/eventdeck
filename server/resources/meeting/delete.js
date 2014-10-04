var Meeting = require('../../db/models/meeting');
var Notification = require('../../db/models/notification');
var log = require('../../helpers/logger');

module.exports = del;

function del(request, reply) {

  Meeting.remove({_id: request.params.id}, function (err){
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, meeting: request.params.id}, '[meeting] error deleting meeting');
      return reply({error: 'There was an error deleting the meeting.'});
    }

    log.info({username: request.auth.credentials.id, meeting: request.params.id}, '[meeting] deleted the meeting');
    reply({success: 'Meeting deleted.'});
    
    Notification.removeByThread('meeting-'+request.params.id, function (err) {
      if(err) { 
        log.error({err: err, username: request.auth.credentials.id}, '[meeting] error deleting meeting notifications');
      }
    });
  });

}
