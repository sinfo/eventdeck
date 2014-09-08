var Event = require('../../db/models/event');
var Notification = require('../../db/models/notification');

module.exports = remove;

function remove(request, reply) {

  Event.del(request.params.id, function(err) {
    if (err) {
      return reply({error: 'There was an error deleting the event.'});
    }

    reply({success: 'Event deleted.'});
    
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
  });

}
