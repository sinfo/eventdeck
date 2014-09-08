var Speaker = require('../../db/models/speaker');

module.exports = list;

function list(request, reply) {

  var memberId = request.params.id;

  Speaker.findByMember(memberId, function (err, result) {
    if (err){
      return reply({error: 'There was an error getting speakers of \'' + memberId + '\'.'});
    }
    
    reply(result);
  });

}
