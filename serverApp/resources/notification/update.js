var Notification = require('../../db/models/notification');
var log = require('../../helpers/logger');

module.exports = update;

function update(request, reply) {

  Notification.update({_id: request.params.id}, request.payload, function (err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, notification: request.params.id}, '[notification] error updating notification');
      return reply({error: 'There was an error updating the notification.'});
    }
    
    log.info({username: request.auth.credentials.id, notification: request.params.id}, '[notification] updated notification');
    reply({success: 'Notification updated.'});
  });

}
