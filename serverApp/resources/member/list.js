var Member = require('../../db/models/member');

module.exports = list;

function list(request, reply) {

  Member.findAll(function (err, result) {
    if (err) {
      return reply({error: 'There was an error getting all the members.'});
    }
    if (!result || result.length < 1) {
      return reply({error: 'There are no members.'});
    }

    reply(result);
  });

}
