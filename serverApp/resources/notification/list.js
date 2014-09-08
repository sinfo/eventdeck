var Notification = require('../../db/models/notification');

module.exports = list;

function list(request, reply) {

  Notification.findAll(function (err, result) {
    if (err) {
      return reply({error: 'There was an error getting all the notifications.'});
    }
    if (!result || result.length < 1) {
      return reply({error: 'There are no notifications.'});
    }

    reply(result);
  });

}
