var Member = require('../../db/models/member');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Member.findAll(function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[member] error listing members');
      return reply({error: 'There was an error getting all the members.'});
    }

    reply(result);
  });

}
