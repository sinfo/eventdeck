var Meeting = require('../../db/models/meeting');
var Topic   = require('../../db/models/topic');
var notification = require('../notification');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  Meeting.findById(request.params.id, function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, meeting: request.params.id}, '[meeting] error getting meeting');
      return reply({error: 'There was an error getting the meetings.'});
    }
    
    if (!result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id, meeting: request.params.id}, '[meeting] couldn\'t find meeting');
      return reply({error: 'Could not find the meeting.'});
    }

    var meeting = result[0].toObject();

    Topic.findByMeeting(meeting._id, function (err, topics) {
      if(err) {
        log.error({err: err, username: request.auth.credentials.id, meeting: request.params.id}, '[meeting] error getting meeting topics');
      }
      meeting.topics = topics;

      reply(meeting);
    });

    notification.read(request.auth.credentials.id, 'meeting-' + meeting._id);

  });

}
