var Member     = require('./../../db/models/member.js');
var email       = require('./');
var async       = require('async');
var url_prefix = require('./../../../config').url;

exports = module.exports = notify;

function notify(memberId, company) {

  var member  = {};

  async.series([
      getMember,
      sendEmail
    ], done);    

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
    var message = {
      to:       member.name + "<" +member.mails.sinfo + ">",
      subject: "[SINFO] New company for you: "+company.name+"!",
      text:    "You are now the responsible member of "+company.name+"! \n\nCheck it out:\n"+url_prefix+"#/company/"+company.id, 
    };

    // send the message and get a callback with an error or details of the message that was sent
    email.send(message, function(err, message) {
      if(err) { cb(err); }
      console.log(err || message); 
      cb();
    });
  }

  function done(err) {
    if (err) {
      console.log("There was an error!");
    } else {
      console.log("Email Sent!");
    }
  }
}