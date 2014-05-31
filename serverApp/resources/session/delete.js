var Session = require('./../../db/models/session.js');
var Notification = require('./../../db/models/notification.js');

module.exports = remove;

function remove(request, reply) {

  Session.del(request.params.id, function(err) {
    if (err) {
      reply({error: "There was an error deleting the session."});
    }
    else {
      reply({success: "Session deleted."});
      
      Notification.removeByThread('session-'+request.params.id, function (err, result) {
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
