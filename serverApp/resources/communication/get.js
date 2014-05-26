var Communication = require('./../../db/models/communication.js');

module.exports = get;

function get(request, reply) {

  var communicationId = request.params.id;

  Communication.findById(communicationId, function(err, result) {
    if (err) {
      reply({error: "There was an error getting communication with id '" + communicationId + "'."});
    }
    else if (result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Could not find communication with id '" + request.params.id + "'."});
    }
  });

}
