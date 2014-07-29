var Communication = require('./../../db/models/communication.js');

module.exports = list;

function list(reply) {

  Communication.getAllThreads(function(err, result) {
    if (err) {
      reply({error: "There was an error getting all communications."});
    }
    else {
      reply(result);
    }
  });

}
