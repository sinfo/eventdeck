var Member = require('./../../db/models/member.js');

module.exports = get;

function get(request, reply) {

  var memberId = request.auth.credentials.id;

  Member.findById(memberId, function (err, result) {
    if (err) {
      reply({error: "There was an error getting the member."});
    }
    else if (result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Could not find member '" + memberId + "'."});
    }
  });

}
