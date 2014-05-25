var Member = require('./../../db/models/member.js');

module.exports = update;

function update(request, reply) {

  Member.update({id: request.params.id}, request.payload, function (err) {
    if (err) {
      reply({error: "There was an error updating the member."});
    }
    else {
      reply({success: "Member updated."});
    }
  });

}
