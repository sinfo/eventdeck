var Member = require('../../db/models/member');

module.exports = get;

function get(request, reply) {

  var memberId = request.params.id;

  Member.findById(memberId, function (err, result) {
    if (err) {
      return reply({error: 'There was an error getting the member.'});
    }
    if (!result || result.length < 1) {
      return reply({error: 'Could not find member \'' + memberId + '\'.'});
    }

    reply(result[0]);
  });

}
