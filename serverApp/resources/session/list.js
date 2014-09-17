var Session = require('../../db/models/session');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Session.findAll(function(err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[session] error listing sessions');
      return reply({error: 'There was an error getting all the sessions.'});
    }
    
    reply(result);
  });

}
