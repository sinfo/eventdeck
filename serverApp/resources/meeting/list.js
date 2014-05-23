var Meeting = require('./../../db/models/meeting.js');

module.exports = list;

function list(request, reply) {

  Meeting.findAll(gotMeetings);

  function gotMeetings(err, result) {
    if (err) {
      reply({error: "There was an error getting all the meetings."});
    }
    else {
      reply(result);
    }
  }

}
