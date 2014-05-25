var Member = require('./../../db/models/member.js');

module.exports = create;

function create(request, reply) {

  var member = new Member(request.payload);

  if (!member.id || !member.istId) {
    reply({error: "No id or istId specified."});
    return;
  }

  member.save(function (err) {
    if (err) {
      reply({error: "There was an error creating the member."});
    }
    else {
      reply({success: "Member created.", id: member.id});
    }
  });

}
