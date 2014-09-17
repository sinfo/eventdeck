var Topic = require('../../db/models/topic');
var log = require('../../helpers/logger');

exports = module.exports = list;

function list(request, reply) {

  Topic.findByTag(request.params.id, function (err, result) {
    if (err) {
       log.error({err: err, username: request.auth.credentials.id, tag: request.params.id}, '[topic] error getting topics by tag');
     return reply(err);
    }
    
    reply(result);
  });

}
