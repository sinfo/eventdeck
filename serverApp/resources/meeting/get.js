var async   = require("async");
var Meeting = require("./../../db/models/meeting.js");
var Topic   = require("./../../db/models/topic.js");

module.exports = get;

function get(request, reply) {

  if (request.params.id === "all") {
    Meeting.findAll(gotMeetings);
  }
  else {
    Meeting.findById(request.params.id, gotMeetings);
  }

  function gotMeetings(err, result) {
    if (err) {
      reply({error: "There was an error getting the meetings."});
    }
    else {
      async.eachSeries(result, function (meeting, nextMeeting) {
        var remove = [];

        async.eachSeries(meeting.topics, function (topicId, nextTopic) {
          Topic.findById(topicId, function (err, array) {
            if (err || array.length === 0) {
              remove.push(topicId);
            }

            nextTopic();
          });
        },
        function (err) {
          for (var i in remove) {
            meeting.topics.splice(meeting.topics.indexOf(remove[i]), 1);
          }

          nextMeeting();
        });
      },
      function (err) {
        reply(result);
      });
    }
  }

}
