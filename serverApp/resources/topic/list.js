var Topic = require('./../../db/models/topic.js');

exports = module.exports = list;

function list(request, reply) {
  Topic.findAll(gotTopic);

  function gotTopic(err, result) {
    if (err)
      reply(err);
    else
      reply(result);
  }
}
