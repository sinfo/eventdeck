var Meeting = require('../../db/models/meeting');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Meeting.findAll(gotMeetings);

  function gotMeetings(err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[meeting] error listing meetings');
      return reply({error: 'There was an error getting all the meetings.'});
    }
    
    reply(result);
  }

}
