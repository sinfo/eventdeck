var Meeting = require('../../db/models/meeting');
var notification  = require('../notification');
var log = require('../../helpers/logger');

module.exports = create;

function create(request, reply) {

  var meeting = new Meeting(request.payload);

  meeting.save(function (err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, meeting: meeting}, '[meeting] error creating new meeting');
      return reply({error: 'There was an error creating the meeting.'});
    }

    log.info({username: request.auth.credentials.id, meetingId: meeting._id}, '[meeting] new meeting created');
    notification.notify(request.auth.credentials.id, 'meeting-'+meeting.id, 'created a new meeting', null);

    reply({
      success: 'Meeting created.',
      id: meeting._id
    });
  });

}
