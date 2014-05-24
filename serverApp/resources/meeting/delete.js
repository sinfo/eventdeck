var Meeting = require('./../../db/models/meeting');

module.exports = del;

function del(request, reply) {

  Meeting.remove({_id: request.payload._id}, true, function (err){
    if (err) {
      reply({error: "There was an error deleting the meeting."});
    }
    else {
      reply({success: "Meeting deleted."});
    }
  });

}
