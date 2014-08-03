var Event = require('./../../db/models/event.js');

module.exports = list;

function list(request, reply) {

  Event.findAll(function(err, result) {
    if (err) {
      return reply({error: "There was an error getting all the events."});
    }
    
    reply(result);
  });

}
