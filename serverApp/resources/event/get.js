var Event = require('./../../db/models/event.js');

module.exports = get;

function get(request, reply) {

  Event.findById(request.params.id, function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Unable to find event with id '" + request.params.id + "'."});
    }
  });

}
