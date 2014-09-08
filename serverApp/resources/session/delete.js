var Session = require('../../db/models/session');
var Notification = require('../../db/models/notification');

module.exports = remove;

function remove(request, reply) {

  Session.del(request.params.id, function(err) {
    if (err) {
      return reply({error: 'There was an error deleting the session.'});
    }

    reply({success: 'Session deleted.'});
    
    Notification.removeByThread('session-'+request.params.id, function (err) {
      if(err) { 
        console.log(err); 
      }
    });
    
    Notification.removeBySource(request.params.id, function (err) {
      if(err) { 
        console.log(err); 
      }
    });
  });

}
