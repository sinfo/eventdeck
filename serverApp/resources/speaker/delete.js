var Comment       = require('./../../db/models/comment');
var Communication = require('./../../db/models/communication');
var Notification  = require('./../../db/models/notification');
var Speaker       = require('./../../db/models/speaker');
var log = require('../../helpers/logger');

module.exports = del;

function del(request, reply) {

  var speakerId = request.params.id;

  if (!checkPermissions()) {
    log.warn({username: request.auth.credentials.id, speaker: speakerId}, '[speaker] tried to delete the speaker');
    return reply({error: 'You do not have permissions to delete a speaker.'});
  }

  Speaker.remove({id: speakerId}, function (err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, speaker: speakerId}, '[speaker] error deleting speaker');
      return reply({error: 'There was an error deleting the speaker.'});
    }

    var thread = 'speaker-' + speakerId;
    Comment.removeByThread(thread, function (err) {
      if(err) {
        log.error({err: err, username: request.auth.credentials.id, speaker: speakerId, thread: thread}, '[speaker] error deleting comments');
      }
    });

    Communication.removeByThread(thread, function (err) {
      if(err) {
        log.error({err: err, username: request.auth.credentials.id, speaker: speakerId, thread: thread}, '[speaker] error deleting communications');
      }
    });

    Notification.removeByThread(thread, function (err) {
      if(err) {
        log.error({err: err, username: request.auth.credentials.id, speaker: speakerId, thread: thread}, '[speaker] error deleting notifications');
      }
    });

    log.info({username: request.auth.credentials.id, speaker: speakerId}, '[speaker] deleted the speaker');

    reply({success: 'Speaker deleted.'});
  });


  function checkPermissions() {
    return request.auth.credentials.roles.filter(function (o) {
      return o.id === 'development-team' || o.id === 'coordination';
    }).length > 0;
  }

}
