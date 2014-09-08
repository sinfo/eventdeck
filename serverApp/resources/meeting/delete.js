var Meeting = require('../../db/models/meeting');
var Notification = require('../../db/models/notification');

module.exports = del;

function del(request, reply) {

  Meeting.remove({_id: request.params.id}, function (err){
    if (err) {
      return reply({error: 'There was an error deleting the meeting.'});
    }

    reply({success: 'Meeting deleted.'});
    
    Notification.removeByThread('meeting-'+request.params.id, function (err) {
      if(err) { 
        console.log(err); 
      }
    });
  });

}
