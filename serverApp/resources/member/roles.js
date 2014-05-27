var Member = require('./../../db/models/member.js');

module.exports = list;

function list(request, reply) {

  Member.findAllRoles(function (err, result) {
    if (err) {
      reply({error: "There was an error getting all the roles."});
    }
    else {
      var rolesIds = [];
      var roles = [];

      for(var i=0; i<result.length; i++) {
        if(rolesIds.indexOf(result[i].id) == -1) {
          rolesIds.push(result[i].id)
          roles.push({
            name: result[i].name,
            id: result[i].id
          })
        }
      }

      reply(roles);
    }
  });

}
