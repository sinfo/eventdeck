var Topic = require('../../db/models/topic');

module.exports = list;

function list(request, reply) {
  Topic.findAll(gotTopic);

  function gotTopic(err, result) {
    if (err) {
      return reply({error: 'There was an error getting all topics.'});
    }
    
    reply(result);
  }
}
