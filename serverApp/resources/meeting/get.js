var Meeting = require('../../db/models/meeting');
var Topic   = require('../../db/models/topic');
var notification = require('../notification');

module.exports = get;

function get(request, reply) {

  Meeting.findById(request.params.id, function (err, result) {
    if (err) {
      return reply({error: 'There was an error getting the meetings.'});
    }
    
    if (!result || result.length < 1) {
      return reply({error: 'Could not find the meeting.'});
    }

    var meeting = result[0].toObject();

    Topic.findByMeeting(meeting._id, function (err, topics) {
      meeting.topics = topics;

      reply(meeting);
    });

    notification.read(request.auth.credentials.id, 'meeting-' + meeting._id);

  });

}
