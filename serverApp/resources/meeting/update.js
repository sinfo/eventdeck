var Meeting = require('../../db/models/meeting');

module.exports = update;

function update(request, reply) {

  Meeting.update({_id: request.params.id}, request.payload, function (err){
    if (err) {
      return reply({error: 'There was an error updating the meeting.'});
    }
    
    //notification.new(request.auth.credentials.id, 'meeting-'+meeting.id, meeting.name, 'meeting',request.auth.credentials.name);
    reply({success: 'Meeting updated.'});
  });

}
