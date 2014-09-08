var Member = require('../../db/models/member');

module.exports = get;

function get(request, reply) {

  var roleId = request.params.id;

  Member.findByRole(roleId, function (err, result) {
    if (err) {
      return reply({error: 'There was an error getting the members by role.'});
    }
    if (!result || result.length < 1) {
      return reply({error: 'Could not find members with role \'' + roleId + '\'.'});
    }
    
    reply(result);
  });

}
