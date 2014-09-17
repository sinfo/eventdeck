var Topic = require('../../db/models/topic');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {
  Topic.findAll(gotTopic);

  function gotTopic(err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[topic] error getting all topics');
      return reply({error: 'There was an error getting all topics.'});
    }
    
    reply(result);
  }
}
