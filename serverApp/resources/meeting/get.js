var Meeting = require('./../../db/models/meeting.js');

module.exports = get;

function get(request, reply) {

  Meeting.findById(request.params.id, gotMeeting);

  function gotMeeting(err, result) {
    if (err) {
      reply({error: "There was an error getting all the meetings."});
    }
    else if (result && result.length > 0) {
      reply(result[0]);
    }
    else {
    	reply({error: "Could not find the meeting."});
    }
  }

}
