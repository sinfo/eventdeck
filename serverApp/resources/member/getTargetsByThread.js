var async   = require('async');
var Company = require('../../db/models/company');
var Speaker = require('../../db/models/speaker');
var Topic   = require('../../db/models/topic');


exports = module.exports = get;

function get(thread, callback) {

  var speaker = {};
  var company = {};
  var topic = {};
  var meeting = {};

  var companyId;
  var speakerId;
  var topicId;
  var meetingId;

  if(thread.indexOf('company') != -1) {
    companyId = thread.split('company-')[1];

    Company.findById(companyId, gotCompany);

    function gotCompany(err, result) {
      if (err) {
        return callback(err);
      }
      if (!result || result.length < 1) {
        return callback('No company with the ID: ' + companyId);
      }
  
      company = result[0];
      callback(null, [company.member]);
    }
  }
  else if (thread.indexOf('speaker') != -1) {
    speakerId = thread.split('speaker-')[1];

    Speaker.findById(speakerId, gotSpeaker);

    function gotSpeaker(err, result) {
      if (err) {
        return callback(err);
      }
      if (!result || result.length < 1) {
        return callback('No speaker with the ID: ' + speakerId);
      }

      speaker = result[0];
      callback(null, [speaker.member]);
    }
  }
  else if (thread.indexOf('topic') != -1) {
    topicId = thread.split('topic-')[1];

    Topic.findById(topicId, gotTopic);

    function gotTopic(err, result) {
      if (err) {
        return callback(err);
      }
      if (!result || result.length < 1) {
        return callback('No topic with the ID: ' + topicId);
      }

      topic = result[0];
      var targets = topic.targets;
      if(targets.indexOf(topic.author) == -1) {
        targets.push(topic.author);
      }
      callback(null, targets);
    }
  }
  else if (thread.indexOf('meeting') != -1) {
    meetingId = thread.split('meeting-')[1];

    Speaker.findById(meetingId, gotMeeting);

    function gotMeeting(err, result) {
      if (err) {
        return callback(err);
      }
      if (!result || result.length < 1) {
        return callback('No meeting with the ID: ' + meetingId);
      }

      meeting = result[0];
      var targets = meeting.attendants;
      callback(null, targets);
    }
  }
  else {
    callback('Thread kind not supported');
  }
}
