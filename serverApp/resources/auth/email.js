var async = require('async');
var email = require('../email');
var Member = require('../../db/models/member');
var url_prefix = require('../../../config').url;
var log = require('../../helpers/logger');

module.exports = sendCode;

function sendCode(request, reply) {
  
  if (request.auth.isAuthenticated) {
    log.warn('[auth]', request.auth.credentials.id, 'tried to login again with', request.params.id);
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

    log.debug('[auth] LOGIN CODE', loginCode);
    log.debug('[auth] ALL LOGIN CODES', member.loginCodes);

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
      to:       member.name + '<' +member.mails.sinfo + '>',
      subject: '[SINFO] Login code for The Tool!',
      text:    'Hey '+member.name+'!\n\n Here is your code for logging in on The Tool: '+loginCode+'\n\n'+url_prefix+'#/login/'+member.id+'/'+loginCode,
    };
  
    // send the message and get a callback with an error or details of the message that was sent
    email.send(message, cb); 
  }

  function done(err) {
    if(err) { 
      log.error('[auth] Error sending login code email', err); 
      return reply({error:'There was an error!'});
    }
    
    log.info('[auth] Login code email sent to', member.id); 
    reply({success:'Mail sent!'});
  }
}

function getRandomString(lenght) {
  return (Math.random().toString(36)+'00000000000000000').slice(2, lenght+2).toUpperCase();
}
