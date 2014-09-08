var Event = require('../../db/models/event');

module.exports = get;

function get(request, reply) {

  Event.findById(request.params.id, function(err, result) {
    if (err || !result || result.length < 1) {
      return reply({error: 'Unable to find event with id \'' + request.params.id + '\'.'});
    }
    
    reply(result[0]);
  });

}
