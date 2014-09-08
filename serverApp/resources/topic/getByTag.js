var Topic = require('../../db/models/topic');

exports = module.exports = list;

function list(request, reply) {

  Topic.findByTag(request.params.id, function (err, result) {
    if (err) {
      return reply(err);
    }
    
    reply(result);
  });

}
