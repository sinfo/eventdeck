var async   = require("async");
var Meeting = require("./../../db/models/meeting.js");
var Topic   = require("./../../db/models/topic.js");
var notification = require('./../notification');

module.exports = get;

function get(request, reply) {

  Meeting.findById(request.params.id, function (err, result) {
    if (err) {
      reply({error: "There was an error getting the meetings."});
    }
    else if (result && result.length > 0) {
      var meeting = result[0].toObject();

      Topic.findByMeeting(meeting._id, function (err, topics) {
        meeting.topics = topics;

        reply(meeting);
      });

      notification.read(request.auth.credentials.id, 'meeting-' + meeting._id);
    }
    else {
      reply({error: "Could not find the meeting."});
    }
  });

}
