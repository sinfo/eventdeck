var Session = require('./../../db/models/session.js');

module.exports = remove;

function remove(request, reply) {

  Session.del(request.params.id, function(err) {
    if (err) {
      reply({error: "There was an error deleting the session."});
    }
    else {
      reply({success: "Session deleted."});
    }
  });

}
