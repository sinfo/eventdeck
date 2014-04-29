var Member     = require('./../../db/models/member.js');
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
      text:    "You are now the responsible member of "+company.name+"! \n\nCheck it out:\nhttp://the-tool.franciscodias.net/#/company/"+company.id, 
      from:    "The Tool! <thetoolsinfo@gmail.com>",
      to:       member.name + "<" +member.mails.sinfo + ">",
      subject: "[SINFO] New company for you: "+company.name+"!"
    };

    // send the message and get a callback with an error or details of the message that was sent
    server.send(message, function(err, message) {
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