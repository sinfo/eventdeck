var Tag = require('../../db/models/tag');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Tag.findAll(function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[tag] error listing tags');
      return reply({error: 'There was an error getting all tags.'});
    }
  
    reply(result);
  });

}
