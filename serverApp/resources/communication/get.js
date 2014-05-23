var Communication = require('./../../db/models/communication.js');

module.exports = get;

function get(request, reply) {

  Communication.findById(request.params.id, function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Unable to find communication with id '" + request.params.id + "'."});
    }
  });

}
