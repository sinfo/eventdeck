var Notification = require('../../db/models/notification');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  Notification.findById(request.params.id, function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, notification: request.params.id}, '[notification] error getting notification');
      return reply({error: 'There was an error getting the notification.'});
    }
    if (!result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id, notification: request.params.id}, '[notification] couldn\'t find notification');
      reply({error: 'Could not find the notification.'});
    }
    
    return reply(result[0]);
  });

}
