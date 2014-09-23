var Communication = require('../../db/models/communication.js');
var log = require('../../helpers/logger');

module.exports = getByEvent;

function getByEvent(request, reply) {

  var event = request.params.event;

  Communication.findByEvent(event, function(err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[communication] error getting communication');
      return reply({error: 'There was an error getting communication with event \'' + event + '\'.'});
    }
    if (!result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id}, '[communication] could not find the communication with event '+request.params.event);
      return reply({error: 'Could not find communication with event \'' + event + '\'.'});
    }
    
    reply(result);
  });

}
