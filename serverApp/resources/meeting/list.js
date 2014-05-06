var Meeting = require('./../../db/models/meeting.js');

exports = module.exports = list;

function list(request, reply) {
  Meeting.findAll(gotMeetings);

  function gotMeetings(err, result) {
    if (err)
      reply(err);
    else
      reply(result);
  }
}
