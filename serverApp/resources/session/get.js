var Session = require('../../db/models/session');

module.exports = get;

function get(request, reply) {

  Session.findById(request.params.id, function(err, result) {
    if (err || !result || result.length < 1) {
      return reply({error: 'Unable to find session with id \'' + request.params.id + '\'.'});
    }

    reply(result[0]);
  });

}
