var Topic        = require('../../db/models/topic');
var Notification = require('../notification');

module.exports = get;

function get(request, reply) {

  var topicId = request.params.id;

  Topic.findById(topicId, gotTopic);

  function gotTopic(err, result) {
    if (err) {
      return reply({error: 'There was an error getting topic with id \'' + topicId + '\'.'});
    }
    
    if (!result || result.length < 1) {
      return reply({error: 'Could not find topic with id \'' + topicId + '\'.'});
    }

    reply(result[0]);
    Notification.read(request.auth.credentials.id, 'topic-' + topicId);
  }

}
