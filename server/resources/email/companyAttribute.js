var Member     = require('./../../db/models/member.js');
var email      = require('./');
var async      = require('async');
var url_prefix = require('./../../../config').url;
var log = require('../../helpers/logger');

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
      subject: '[SINFO] New company for you: '+company.name+'!',
      text:    'You are now the responsible member of '+company.name+'! \n\nCheck it out:\n'+url_prefix+'#/company/'+company.id, 
    };

    // send the message and get a callback with an error or details of the message that was sent
    email.send(message, function(err, message) {
      if(err) { return cb(err); }
      cb();
    });
  }

  function done(err) {
    if (err) {
      return log.error({err: err}, '[email] error sending company %s atribute email to %s', company.id, memberId);
    }

    return log.info({err: err}, '[email] company %s atribute email sent to %s', company.id, memberId);
  }
}