var Meeting = require('./../../db/models/meeting');

exports = module.exports = create;

function create(request, reply) {

  var meeting = new Meeting(request.payload);

  meeting.save(function (err){
    if (err) {
      console.log("Error creating meeting!\n" + err);
      reply({error: "There was an error!"});
    }
    else {
      //notification.new(request.auth.credentials.id, 'meeting-'+meeting.id, meeting.name, "meeting",request.auth.credentials.name);
      console.log("Meeting created: " + meeting._id);
      reply({
        success: "Meeting created!",
        id: meeting._id
      });
    }
  });
}
