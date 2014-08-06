var Event = require('./../../db/models/event.js');
var Notification = require('./../../db/models/notification.js');

module.exports = remove;

function remove(request, reply) {

  Event.del(request.params.id, function(err) {
    if (err) {
      reply({error: "There was an error deleting the event."});
    }
    else {
      reply({success: "Event deleted."});
      
      Notification.removeByThread('event-'+request.params.id, function (err, result) {
        if(err) { 
          console.log(err); 
        }
      });
      
      Notification.removeBySource(request.params.id, function (err, result) {
        if(err) { 
          console.log(err); 
        }
      });
    }
  });

}
