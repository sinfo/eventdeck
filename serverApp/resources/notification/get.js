var Notification = require('./../../db/models/notification.js');

module.exports = get;

function get(request, reply) {

  Notification.findById(request.params.id, function (err, result) {
    if (err) {
      reply({error: "There was an error getting the notification."});
    }
    else if (result && result.length > 0) {
    	reply(result[0]);
    }
    else {
      reply({error: "Could not find the notification."});
    }
  });

}
