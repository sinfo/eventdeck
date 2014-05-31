var Member     = require('./../../db/models/member.js');
var Company     = require('./../../db/models/company.js');
var Speaker     = require('./../../db/models/speaker.js');
var email       = require('emailjs');
var async       = require('async');
var emailConfig = require('./../../emailConfig');

var server  = email.server.connect({
  user:     emailConfig.user,
  password: emailConfig.password,
  host:     emailConfig.host,
  ssl:      emailConfig.ssl
});

exports = module.exports = notify;

function notify(comment) {

  var member  = {};
  var speaker = {};
  var company = {};

  var memberId;
  var companyId;
  var speakerId;

  if(comment.thread.indexOf("company") != -1) {
    companyId = comment.thread.split("company-")[1];

    async.series([
        getCompany,
        getMember,
        sendEmail
      ], done);
  }
  else if (comment.thread.indexOf("speaker") != -1) {
    speakerId = comment.thread.split("speaker-")[1];

    async.series([
        getSpeaker,
        getMember,
        sendEmail
      ], done);
  }

  function getCompany(cb) {
    Company.findById(companyId, gotCompany);

    function gotCompany(err, result) {
      if (err) {
        cb(err);
      }

      if (result.length > 0) {
        company = result[0];
        memberId = company.member;
        cb();
      }
      else {
        cb(Hapi.error.conflict('No company with the ID: ' + companyId));
      }
    }
  }

  function getSpeaker(cb) {
    Speaker.findById(speakerId, gotSpeaker);

    function gotSpeaker(err, result) {
      if (err) {
        cb(err);
      }

      if (result.length > 0) {
        speaker = result[0];
        memberId = speaker.member;
        cb();
      }
      else {
        cb(Hapi.error.conflict('No speaker with the ID: ' + speakerId));
      }
    }
  }

  function getMember(cb) {
    Member.findById(memberId, gotMember);

    function gotMember(err, result) {
      if (err) {
        cb(err);
      }

      if (result.length > 0) {
        member = result[0];
        cb();
      }
      else {
        cb(Hapi.error.conflict('No member with the ID: ' + memberId));
      }
    }
  }

  function sendEmail(cb) {
    if(member.id != comment.member) {
      var message = null;
      if (company.id) {
        message = {
          text:    "There is a new comment on "+company.name+"'s page. \n\nCheck it out:\nhttp://the-tool.franciscodias.net/#/company/"+company.id,
          from:    "The Tool! <thetoolsinfo@gmail.com>",
          to:       member.name + "<" +member.mails.sinfo + ">",
          subject: "[SINFO] New comment on "+company.name+"!"
        };
      }
      else if (speaker.id){
        message = {
          text:    "There is a new comment on "+speaker.name+"'s page. \n\nCheck it out:\nhttp://the-tool.franciscodias.net/#/speaker/"+speaker.id,
          from:    "The Tool! <thetoolsinfo@gmail.com>",
          to:       member.name + "<" +member.mails.sinfo + ">",
          subject: "[SINFO] New comment on "+speaker.name+"!"
        };
      }


      // send the message and get a callback with an error or details of the message that was sent
      server.send(message, function(err, message) {
        if(err) { cb(err); }
        cb();
      });
    }
    else {
      console.log("Commenter is the responsible");
      cb("Commenter is the responsible");
    }
  }

  function done(err) {
    if (err) {
      console.log("There was an error! "+err);
    } else {
      console.log("Email Sent!");
    }
  }
}
