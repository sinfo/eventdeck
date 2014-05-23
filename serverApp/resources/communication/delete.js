var Communication = require('./../../db/models/communication.js');

module.exports = remove;

function remove(request, reply) {

  Communication.del(request.params.id, function(err) {
    if (err) {
      reply({error: "There was an error deleting the communication."});
    }
    else {
      reply({success: "Communication deleted."});
    }
  });

}
