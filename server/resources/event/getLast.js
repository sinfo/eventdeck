var Event = require('../../db/models/event');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Event.findLast(function(err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[event] error getting last event.');
      return reply({error: 'There was an error error getting last event.'});
    }
    
    reply(result[0]);
  });

}
