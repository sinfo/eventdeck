var Speaker = require('./../../db/models/speaker.js');

module.exports = list;

function list(request, reply) {

  var memberId = request.params.id;

  Speaker.findByMember(memberId, function (err, result) {
    if (err){
      reply({error: "There was an error getting speakers of '" + memberId + "'."});
    }
    else {
      reply(result);
    }
  });

}
