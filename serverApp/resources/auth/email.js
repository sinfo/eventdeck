var async = require('async')
var email = require('emailjs');
var Member = require("./../../db/models/member.js");
var url_prefix = require('./../../../config').url;
var emailConfig = require('./../../../config').email;

var server  = email.server.connect({
  user:     emailConfig.user,
  password: emailConfig.password,
  host:     emailConfig.host,
  ssl:      emailConfig.ssl
});

module.exports = sendCode;

function sendCode(request, reply) {
  
  if (request.auth.isAuthenticated) {
    return reply({error: 'You\'re already authenticated'});
  }

  var memberId = request.params.id;
  var member = {};

  var loginCode = getRandomString(4);

  async.series([
    getMember,
    saveLoginCode,
    sendEmail
  ], done);

  function getMember(cb) {
    Member.findById(memberId, gotMember);

    function gotMember(err, result) {
      if (err) { cb(err); }

      if (result.length > 0) {
        member = result[0];
        cb();
      }
      else {
        cb('No member with the ID: ' + memberId);
      }
    }
  }

  function saveLoginCode(cb) {
    member.loginCodes.push({ 
      code: loginCode,
      created: Date.now()
    });

    console.log('LOGIN CODE', loginCode);
    console.log('ALL LOGIN CODES', member.loginCodes);

    Member.update({id: memberId}, {loginCodes: member.loginCodes}, function (err) {
      if (err) {
        console.log(err);
        cb('There was an error updating the member.');
      }
      else {
        cb();
      }
    });
  }

  function sendEmail(cb) {
    var message = {
      text:    "Hey "+member.name+"!\n\n Here is your code for logging in on The Tool: "+loginCode+"\n\n"+url_prefix+"#/login/"+member.id+"/"+loginCode,
      from:    "The Tool! <thetoolsinfo@gmail.com>",
      to:       member.name + "<" +member.mails.sinfo + ">",
      subject: "[SINFO] Login code for The Tool!"
    };
  
    // send the message and get a callback with an error or details of the message that was sent
    server.send(message, function(err, message) {
      if(err) { cb('There was an error sending the email'); }
      console.log(err)
      cb();
    });
  }

  function done(err) {
    if(err) { 
      console.log(err);
      return reply({error:'There was an error!'});
    }
    
    reply({success:'Mail sent!'});
  }
}

function getRandomString(lenght) {
  return (Math.random().toString(36)+'00000000000000000').slice(2, lenght+2).toUpperCase();
}
