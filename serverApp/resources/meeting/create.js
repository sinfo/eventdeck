var Meeting = require('./../../db/models/meeting');

module.exports = create;

function create(request, reply) {

  var meeting = new Meeting(request.payload);

  meeting.save(function (err) {
    if (err) {
      reply({error: "There was an error creating the meeting."});
    }
    else {
      //notification.new(request.auth.credentials.id, 'meeting-'+meeting.id, meeting.name, "meeting",request.auth.credentials.name);
      reply({
        success: "Meeting created.",
        id: meeting._id
      });
    }
  });

}
