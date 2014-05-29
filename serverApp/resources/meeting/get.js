var async   = require("async");
var Meeting = require("./../../db/models/meeting.js");
var Topic = require("./../../db/models/topic.js");

module.exports = get;

function get(request, reply) {

  Meeting.findById(request.params.id, gotMeetings);

  function gotMeetings(err, meetings) {
    if (err) {
      reply({error: "There was an error getting the meetings."});
    }
    else if (meetings && meetings.length > 0) {
      var meeting = meetings[0];

      Topic.findAll(function (err, topics) {
        meeting.topics = topics.filter(function (o) {
          return meeting.topics.indexOf(o._id) != -1;
        }).map(function (o) {
          return o._id;
        });

        reply(meeting);
      });
    }
    else {
      reply({error: "Could not find the meeting."});
    }
  }

}
