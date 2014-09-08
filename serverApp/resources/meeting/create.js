var Meeting = require('../../db/models/meeting');
var notification  = require('../notification');

module.exports = create;

function create(request, reply) {

  var meeting = new Meeting(request.payload);

  meeting.save(function (err) {
    if (err) {
      return reply({error: 'There was an error creating the meeting.'});
    }

    notification.notify(request.auth.credentials.id, 'meeting-'+meeting.id, 'created a new meeting', null);

    reply({
      success: 'Meeting created.',
      id: meeting._id
    });
  });

}
