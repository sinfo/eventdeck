var Meeting = require('../../db/models/meeting');

module.exports = list;

function list(request, reply) {

  Meeting.findAll(gotMeetings);

  function gotMeetings(err, result) {
    if (err) {
      return reply({error: 'There was an error getting all the meetings.'});
    }
    
    reply(result);
  }

}
