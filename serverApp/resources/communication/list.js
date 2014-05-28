var Communication = require('./../../db/models/communication.js');

module.exports = list;

function list(request, reply) {

  Communication.findAll(function(err, result) {
    if (err) {
      reply({error: "There was an error getting all communications."});
    }
    else {
      reply(result.filter(function(e) {
        return e.kind;
      }));
    }
  });

}
