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
      async.series([
        function (cb) {
          async.eachSeries(result, function (meeting, cb) {
            var remove = [];

            async.eachSeries(meeting.topics, function (topicId, cb) {
              Topic.findById(topicId, function (array) {
                if (array.length === 0) {
                  remove.push(topicId);
                }

                cb();
              });
            });

            for (var i in remove) {
              meeting.topics.splice(meeting.topics.indexOf(remove[i]), 1);
            }

            cb();
          });

          cb();
        },
        function (cb) {
          reply(result);

          cb();
        }
      ]);
    }
  }

}
