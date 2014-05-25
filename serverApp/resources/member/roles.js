var Member = require('./../../db/models/member.js');

module.exports = list;

function list(request, reply) {

  Member.findAllRoles(function (err, result) {
    if (err) {
      reply({error: "There was an error getting all the roles."});
    }
    else if (result && result.length > 0) {
      reply(result);
    }
    else {
      reply({error: "There are no roles."});
    }
  });

}
