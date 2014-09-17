var Event = require('../../db/models/event');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  Event.findById(request.params.id, function(err, result) {
    if (err || !result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id}, '[event] error getting event %s', request.params.id);
      return reply({error: 'Unable to find event with id \'' + request.params.id + '\'.'});
    }
    
    reply(result[0]);
  });

}
