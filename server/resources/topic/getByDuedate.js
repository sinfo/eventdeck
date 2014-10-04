var Topic = require('../../db/models/topic');
var log = require('../../helpers/logger');

exports = module.exports = list;

function list(request, reply) {

  Topic.findByDuedate(request.params.start, request.params.end, function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, start: request.params.start, end: request.params.end}, '[topic] error getting topics by due date');
      return reply(err);
    }

    reply(result);
  });

}
