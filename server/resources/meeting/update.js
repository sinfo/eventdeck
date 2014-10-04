var Meeting = require('../../db/models/meeting');
var log = require('../../helpers/logger');

module.exports = update;

function update(request, reply) {

  Meeting.update({_id: request.params.id}, request.payload, function (err){
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, meeting: request.params.id}, '[meeting] error updating meeting');
      return reply({error: 'There was an error updating the meeting.'});
    }
    
    log.info({username: request.auth.credentials.id, meeting: request.params.id}, '[meeting] updated meeting');
    //notification.new(request.auth.credentials.id, 'meeting-'+meeting.id, meeting.name, 'meeting',request.auth.credentials.name);
    reply({success: 'Meeting updated.'});
  });

}
