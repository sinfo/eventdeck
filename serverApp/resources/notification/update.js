var Notification = require('../../db/models/notification');

module.exports = update;

function update(request, reply) {

  Notification.update({_id: request.params.id}, request.payload, function (err) {
    if (err) {
      return reply({error: 'There was an error updating the notification.'});
    }
    
    reply({success: 'Notification updated.'});
  });

}
