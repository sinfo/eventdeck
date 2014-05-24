var Session = require('./../../db/models/session.js');

module.exports = list;

function list(request, reply) {

  Session.findAll(function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result);
    }
    else {
      reply({error: "There was an error getting all sessions."});
    }
  });

}
