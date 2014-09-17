var Member = require('../../db/models/member');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  var roleId = request.params.id;

  Member.findByRole(roleId, function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, role: request.params.id}, '[member] error getting members by role');
      return reply({error: 'There was an error getting the members by role.'});
    }
    
    reply(result);
  });

}
