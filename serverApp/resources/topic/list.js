var Topic = require('./../../db/models/topic.js');

module.exports = list;

function list(request, reply) {
  Topic.findAll(gotTopic);

  function gotTopic(err, result) {
    if (err) {
      reply({error: "There was an error getting all topics."});
    }
    else {
      reply(result);
    }
  }
}
