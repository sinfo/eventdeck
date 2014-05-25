var Member = require('./../../db/models/member.js');

module.exports = del;

function del(request, reply) {

  Member.remove({id: request.params.id}, function (err) {
    if (err) {
      reply({error: "There was an error deleting the member."});
    }
    else {
      reply({success: "Member deleted."});
    }
  });

}
