var Notification = require('../../db/models/notification');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Notification.findAll(function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[notification] error listing notifications');
      return reply({error: 'There was an error getting all the notifications.'});
    }

    reply(result);
  });

}
