var Notification = require('./../../db/models/notification.js');

exports = module.exports = list;

function list(request, reply) {
  Notification.findAll(gotNotifications);

  function gotNotifications(err, result) {
    if (err)
      reply(err);
    else
      reply(result);
  }
}
