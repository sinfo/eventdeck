var Topic        = require('../../db/models/topic');
var Notification = require('../notification');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  var topicId = request.params.id;

  Topic.findById(topicId, gotTopic);

  function gotTopic(err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[topic] error getting topic');
      return reply({error: 'There was an error getting topic with id \'' + topicId + '\'.'});
    }
    
    if (!result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id, topic: request.params.id}, '[topic] couldn\'t find topic');
      return reply({error: 'Could not find topic with id \'' + topicId + '\'.'});
    }

    reply(result[0]);
    Notification.read(request.auth.credentials.id, 'topic-' + topicId);
  }

}
