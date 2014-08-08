var Member  = require('./../../db/models/member.js');
var Request = require("request");

module.exports = create;

function create(request, reply) {

  var member = request.payload;

  if (!member.id) {
    return reply({error: "No id specified."});
  }

  if (member.facebook) {
    Request("http://graph.facebook.com/" + member.facebook, {
      method: "GET",
      json: true
    },
    function (error, response, result) {
      if (!error && response.statusCode == 200) {
        member.facebookId = result.id;
        save(member, reply);
      }
      else {
        reply({error: "There was an error creating the member."});
      }
    });
  }
  else {
    save(member, reply);
  }

}

function save(member) {
  member = new Member(member);

  member.save(function (err) {
    if (err) {
      console.log(err);
      reply({error: "There was an error creating the member."});
    }
    else {
      reply({success: "Member created.", id: member.id});
    }
  });
}
