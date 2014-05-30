var Meeting = require('./../../db/models/meeting');
var notification  = require('./../notification');

module.exports = create;

function create(request, reply) {

  var meeting = new Meeting(request.payload);

  meeting.save(function (err) {
    if (err) {
      reply({error: "There was an error creating the meeting."});
    }
    else {
      notification.notify(request.auth.credentials.id, 'meeting-'+meeting.id, 'created a new meeting', null);

      reply({
        success: "Meeting created.",
        id: meeting._id
      });
    }
  });

}
