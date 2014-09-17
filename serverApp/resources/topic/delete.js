var Topic        = require('../../db/models/topic');
var Notification = require('../../db/models/notification');
var Comment      = require('../../db/models/comment');
var log = require('../../helpers/logger');

module.exports = del;

function del(request, reply) {

  var topicId = request.params.id;

  Topic.del(topicId, function (err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, topic: topicId}, '[topic] error deleting topic');
      return reply({error: 'There was an error deleting the topic with id \'' + topicId + '\'.'});
    }

    var thread = 'topic-' + topicId;
    Notification.removeByThread(thread, function (err) {
      if(err) {
        log.error({err: err, username: request.auth.credentials.id, topic: topicId, thread: thread}, '[topic] error deleting notifications');
      }
    });

    Comment.removeByThread(thread, function (err) {
      if(err) {
        log.error({err: err, username: request.auth.credentials.id, topic: topicId, thread: thread}, '[topic] error deleting comments');
      }
    });

    log.info({username: request.auth.credentials.id, topic: topicId}, '[topic] deleted the topic');

    reply({success: 'Topic deleted.'});
  });

}
