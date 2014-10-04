var Member = require('../../db/models/member');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  var memberId = request.params.id;

  Member.findById(memberId, function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, member: request.params.id}, '[member] error getting member');
      return reply({error: 'There was an error getting the member.'});
    }
    if (!result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id, member: request.params.id}, '[member] couldn\'t find member');
      return reply({error: 'Could not find member \'' + memberId + '\'.'});
    }

    reply(result[0]);
  });

}
