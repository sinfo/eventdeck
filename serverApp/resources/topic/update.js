var Topic = require('../../db/models/topic');
var notification = require('../notification');
var getTargets = require('../member').getTargetsByThread;
var log = require('../../helpers/logger');

module.exports = update;

function update(request, reply) {

  Topic.update({_id: request.payload._id}, request.payload, function (err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, topic: request.params.id}, '[topic] error updating the topic');
      return reply({error: 'There was an error updating the topic with id \'' + request.payload._id + '\'.'});
    }

    getTargets('topic-' + request.payload._id, function (err, targets) {
      if (err) {
        log.error({err: err, username: request.auth.credentials.id, topic: request.params.id}, '[topic] error updating the topic (getting targets)');
      }

      if (!request.payload._voting) {
        notification.notify(request.auth.credentials.id, 'topic-' + request.payload._id, 'updated a topic', null, targets);
      }

      log.info({username: request.auth.credentials.id, topic: request.params.id}, '[topic] topic updated');
      reply({success: 'Topic updated.'});
    });
  });

}
