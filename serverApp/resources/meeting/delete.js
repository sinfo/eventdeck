var Meeting = require('./../../db/models/meeting');
var Notification = require('./../../db/models/notification.js');

module.exports = del;

function del(request, reply) {

  Meeting.remove({_id: request.params.id}, function (err){
    if (err) {
      reply({error: "There was an error deleting the meeting."});
    }
    else {
      reply({success: "Meeting deleted."});
      
      Notification.removeByThread('meeting-'+request.params.id, function (err, result) {
        if(err) { 
          console.log(err); 
        }
      });
    }
  });

}
