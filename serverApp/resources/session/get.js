var Session = require('./../../db/models/session.js');

module.exports = get;

function get(request, reply) {

  Session.findById(request.params.id, function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Unable to find session with id '" + request.params.id + "'."});
    }
  });

}
