var Topic = require('./../../db/models/topic.js');

module.exports = get;

function get(request, reply) {

  var topicId = request.params.id;

  Topic.findById(topicId, gotTopic);

  function gotTopic(err, result) {
    if (err) {
      reply({error: "There was an error getting topic with id '" + topicId + "'."});
    }
    else if (result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Could not find topic with id '" + topicId + "'."});
    }
  }

}
