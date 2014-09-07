var Communication = require('../../db/models/communication.js');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  var communicationId = request.params.id;

  Communication.findById(communicationId, function(err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[communication] error getting communication');
      return reply({error: 'There was an error getting communication with id \'' + communicationId + '\'.'});
    }
    else if (!result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id}, '[communication] could not find the communication with id '+request.params.id);
      return reply(result[0]);
    }
    
    reply({error: 'Could not find communication with id \'' + communicationId + '\'.'});
  });

}
