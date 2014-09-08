var Session = require('../../db/models/session');

module.exports = list;

function list(request, reply) {

  Session.findAll(function(err, result) {
    if (err) {
      return reply({error: 'There was an error getting all the sessions.'});
    }
    
    reply(result);
  });

}
