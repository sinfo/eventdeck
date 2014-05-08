var Meeting = require('./../../db/models/meeting');

exports = module.exports = update;

function update(request, reply) {

  console.log(request.payload);

  var meeting = new Meeting(request.payload);

  meeting.save(function (err){
    if (err) {
      console.log("Error updating meeting!\n" + err);
      reply({error: "There was an error!"});
    }
    else {
      //notification.new(request.auth.credentials.id, 'meeting-'+meeting.id, meeting.name, "meeting",request.auth.credentials.name);
      console.log("Meeting updated: " + meeting._id);
      reply({success: "Meeting updated!"});
    }
  });
}
