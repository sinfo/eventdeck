var Speaker = require('../../db/models/speaker');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  var memberId = request.params.id;

  Speaker.findByMember(memberId, function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, member: request.params.id}, '[speaker] error getting speakers of member');
      return reply({error: 'There was an error getting speakers of \'' + memberId + '\'.'});
    }
    
    reply(result);
  });

}
