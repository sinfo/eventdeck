var Hapi    = require('hapi');
var async   = require('async');
var Speaker = require('./../../db/models/speaker.js');
var Member  = require('./../../db/models/member.js');
var email   = require('emailjs');
var emailConfig   = require('./../../emailConfig');

var server  = email.server.connect({
  user:     emailConfig.user,
  password: emailConfig.password,
  host:     emailConfig.host,
  ssl:      emailConfig.ssl
});


exports = module.exports = get;

/// get Speaker

function get(request, reply) {

  var speakerId = request.params.id;
  var speaker   = {};
  var member    = {};
  var signature = "";

  async.series([
      getSpeaker,
      getMember,
      sendEmail,
    ], done);

  function getSpeaker(cb) {
    Speaker.findById(speakerId, gotSpeaker);

    function gotSpeaker(err, result) {
      if (err) { cb(err); }

      if (result.length > 0) {
        speaker = result[0];
        cb();
      }
      else {
        cb(Hapi.error.conflict('No speaker with the ID: ' + speakerId));
      }
    }
  }

  function getMember(cb) {
    Member.findById(speaker.member, gotMember);

    function gotMember(err, result) {
      if (err) { cb(err); }

      if (result.length > 0) {
        member = result[0];
        signature = "<table style=\"color: rgb(0, 0, 0); font-family:helvetica,arial;font-size:13px;\"><tbody><tr><td style=\"font-family: arial, sans-serif; margin: 0px;\"><a href=\"http://www.facebook.com/sinfoist\" target=\"_blank\"><img src=\"http://static.sinfo.org/SINFO_21/Assinatura/facebook.png\" /></a> <br /><a href=\"http://www.twitter.com/sinfo_ist\" target=\"_blank\"><img src=\"http://static.sinfo.org/SINFO_21/Assinatura/twitter.png\" /></a> <br /><a href=\"http://www.youtube.com/sinfoist\" target=\"_blank\"><img src=\"http://static.sinfo.org/SINFO_21/Assinatura/youtube.png\" /></a> <br /><a href=\"mailto:geral@sinfo.org\" target=\"_blank\"><img src=\"http://static.sinfo.org/SINFO_21/Assinatura/email.png\" /></a></td><td style=\"font-family: arial, sans-serif; margin: 0px; padding: 0px 10px;\"><a href=\"http://sinfo.org/\" target=\"_blank\"><img src=\"http://static.sinfo.org/SINFO_21/Assinatura/Logo%20Fundo%20Branco.png\" width=\"125px\" /></a></td><td style=\"font-family: arial, sans-serif; margin: 0px;\"><b>"+member.name+"</b> <br />"+member.role.replace('(TL)','')+"<br /><a href=\"mailto:"+member.mails.sinfo+"\" target=\"_blank\">"+member.mails.sinfo+"</a> <br />(+351) "+member.phones[0].split(' (')[0]+" </td></tr></tbody></table>";

        cb();
      }
      else {
        cb(Hapi.error.conflict('No member with the ID: ' + memberId));
      }
    }
  }

  function sendEmail(cb){
    var email = request.payload.email;

    var message = {
       text:    "Invitation for Speaking Engagement",
       from:    member.name + "<" +member.mails.sinfo + ">",
       to:      email,
       cc:      member.name + "<" +member.mails.sinfo + ">",
       subject: "[SINFO] Invitation for Speaking Engagement",
       attachment:
       [
          {data:"<html><div style=\"width: 100%;\"><div style=\"margin: 0px auto; text-align: center; overflow: hidden;\"><p style=\"font-size: 40px; font-family: Arial; font-weight: bold; font-style: normal; font-variant: normal; text-decoration: none;\">We want you to speak at</p><img src=\"http://static.sinfo.org/SINFO_21/mailTemplates/Logo.jpg\" alt=\"SINFO - Semana Informática\" /></div><p>Dear "+speaker.name+",</p><p> On behalf of the team organizing SINFO <strong>we would be pleased if you would accept our invitation to speak at our event.</strong></p><p>SINFO is on its 22nd edition and is an event <strong>organized by college students who have a passion for technology and innovation</strong>.Check our <a href=\"http://www.sinfo.org\">website</a> for more thorough information regarding SINFO.</p><p><strong>When: The week from February 9th to February 13th, 2015</strong></p><p><strong>Where: Lisbon Tech (IST - Alameda Campus) - Lisbon, Portugal</strong></p><p>Even though we're a non-funded university event,<span style=\"font-size:19pt;\"><strong>we're fully prepared to cover all travel and lodging expenses.</strong></span></p><p>We're committed to bring to our Country and University the most interesting and innovative speakers in thevarious fields regarding Software Development and Engineering - and that is the reason why we're inviting you.</p><p>"+speaker.paragraph+"</p><p>I hope you find this invitation alluring and that you can give us a positive response.</p><p>My Best Regards,</p><p class=\"normal\">"+signature+"</p></div></html>", alternative:true}
       ],
       "reply-to":member.name + "<" +member.mails.sinfo + ">"
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
      reply({error:"There was an error!"});
    } else {
      reply({message:"Email Sent!"});
    }
  }
}
