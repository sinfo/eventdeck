var Notification = require('./../../db/models/notification.js');

module.exports = update;

function update(request, reply) {

  Notification.update({_id: request.params.id}, request.payload, function (err) {
    if (err) {
      reply({error: "There was an error updating the notification."});
    }
    else {
      reply({success: "Notification updated."});
    }
  });

}
