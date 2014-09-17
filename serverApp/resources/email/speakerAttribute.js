var Member     = require('./../../db/models/member.js');
var email      = require('./');
var async      = require('async');
var url_prefix = require('./../../../config').url;
var log = require('../../helpers/logger');

exports = module.exports = notify;

function notify(memberId, speaker) {

  var member  = {};

  async.series([
      getMember,
      sendEmail
    ], done);    

  function getMember(cb) {
    Member.findById(memberId, gotMember);

    function gotMember(err, result) {
      if (err) {
        return cb(err);
      }
      if (!result || result.length < 1) {
        return cb('No member with the ID: ' + memberId);
      }

      member = result[0];
      cb();
    }
  }

  function sendEmail(cb) {
    var message = {
      to:       member.name + '<' +member.mails.sinfo + '>',
      subject: '[SINFO] New speaker for you: '+speaker.name+'!',
      text:    'You are now the responsible member of '+speaker.name+'! \n\nCheck it out:\n'+url_prefix+'#/speaker/'+speaker.id, 
    };

    // send the message and get a callback with an error or details of the message that was sent
    email.send(message, function(err, message) {
      if(err) { return cb(err); }
      cb();
    });
  }

  function done(err) {
    if (err) {
      return log.error({err: err}, '[email] error sending speaker %s atribute email to %s', speaker.id, memberId);
    }

    return log.info({err: err}, '[email] speaker %s atribute email sent to %s', speaker.id, memberId);
 }
}