var Member = require('./../../db/models/member.js');

module.exports = get;

function get(request, reply) {

  var roleId = request.params.id;

  Member.findByRole(roleId, function (err, result) {
    if (err) {
      reply({error: "There was an error getting the members by role."});
    }
    else if (result && result.length > 0) {
      reply(result);
    }
    else {
      reply({error: "Could not find members with role '" + roleId + "'."});
    }
  });

}
