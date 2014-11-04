var async          = require('async');
var Notification   = require('../../db/models/notification');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  var threadId;
  var notifications;

  if(request.path.indexOf('/api/company/') != -1) {
    threadId = 'company-'+request.params.id;
  }
  else if(request.path.indexOf('/api/speaker/') != -1) {
    threadId = 'speaker-'+request.params.id;
  }
  else if(request.path.indexOf('/api/topic/') != -1) {
    threadId = 'topic-'+request.params.id;
  }

  async.series([
      getNotifications,
    ], done);

  function getNotifications(cb) {
    Notification.findByThread(threadId, gotNotifications);

    function gotNotifications(err, result) {
      if (err) { return cb(err); }
      notifications = result;
      cb();
    }
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, thread: threadId}, '[notification] error listing notifications');
      return reply({error: 'There was an error listing the notifications'});
    } 

    reply(notifications);
  }
}