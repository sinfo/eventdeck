var Communication = require('./../../db/models/communication.js');

module.exports = list;

function list(request, reply) {

  Communication.findByThreadLast(request, function (err, result) {
    if (err) {
      reply({error: "Error getting communications from '" + threadId + "'."});
    }
    else {
      reply(result);
    }
  });
}
