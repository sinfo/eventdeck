var async   = require("async");
var Meeting = require("./../../db/models/meeting.js");
var Topic   = require("./../../db/models/topic.js");

module.exports = get;

function get(request, reply) {

  Meeting.findById(request.params.id, function (err, result) {
    if (err) {
      reply({error: "There was an error getting the meetings."});
    }
    else if (result && result.length > 0) {
      var meeting = {};

      for (var key in result[0]) {
        meeting[key] = result[0][key];
      }

      Topic.findByMeeting(meeting._id, function (err, topics) {
        meeting.topics = "carai";

        console.log(meeting);

        reply(meeting);
      });
    }
    else {
      reply({error: "Could not find the meeting."});
    }
  });

}
