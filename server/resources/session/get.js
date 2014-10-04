var Session = require('../../db/models/session');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  Session.findById(request.params.id, function(err, result) {
    if (err || !result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id, session: request.params.id}, '[session] error getting session');
      return reply({error: 'Unable to find session with id \'' + request.params.id + '\'.'});
    }

    reply(result[0]);
  });

}
