var async   = require('async');
var Member  = require('./../../db/models/member.js');
var Company = require('./../../db/models/company.js');
var Speaker = require('./../../db/models/speaker.js');
var Topic   = require('./../../db/models/topic.js');


exports = module.exports = get;

function get(thread, callback) {

  var member  = {};
  var speaker = {};
  var company = {};
  var topic = {};
  var meeting = {};

  var memberId;
  var companyId;
  var speakerId;
  var topicId;
  var meetingId;

  if(thread.indexOf("company") != -1) {
    companyId = thread.split("company-")[1];

    Company.findById(companyId, gotCompany);

    function gotCompany(err, result) {
      if (err) {
        callback(err);
      }

      if (result.length > 0) {
        company = result[0];
        callback(null, [company.member]);
      }
      else {
        callback('No company with the ID: ' + companyId);
      }
    }
  }
  else if (thread.indexOf("speaker") != -1) {
    speakerId = thread.split("speaker-")[1];

    Speaker.findById(speakerId, gotSpeaker);

    function gotSpeaker(err, result) {
      if (err) {
        callback(err);
      }

      if (result.length > 0) {
        speaker = result[0];
        callback(null, [speaker.member]);
      }
      else {
        callback('No speaker with the ID: ' + speakerId);
      }
    }
  }
  else if (thread.indexOf("topic") != -1) {
    topicId = thread.split("topic-")[1];

    Speaker.findById(topicId, gotTopic);

    function gotTopic(err, result) {
      if (err) {
        callback(err);
      }

      if (result.length > 0) {
        topic = result[0];
        var targets = topic.targets;
        if(targets.indexOf(topic.author) == -1) {
          targets.push(topic.author);
        }
        callback(null, targets);
      }
      else {
        callback('No topic with the ID: ' + topicId);
      }
    }
  }
  else if (thread.indexOf("meeting") != -1) {
    meetingId = thread.split("meeting-")[1];

    Speaker.findById(meetingId, gotMeeting);

    function gotMeeting(err, result) {
      if (err) {
        callback(err);
      }

      if (result.length > 0) {
        meeting = result[0];
        var targets = meeting.attendants;
        callback(null, targets);
      }
      else {
        callback('No meeting with the ID: ' + meetingId);
      }
    }
  }
  else {
    callback('Thread kind not supported');
  }
}
