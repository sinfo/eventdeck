var Communication = require('./../../db/models/communication.js');

module.exports = list;

function list(request, reply) {

  Communication.findAll(function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result);
    }
    else {
      reply({error: "There was an error getting all communications."});
    }
  });

}
