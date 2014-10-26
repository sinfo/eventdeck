var Boom = require('boom');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var url_prefix = require('config').url;


server.method('auth.createCode', createCode, {});
server.method('auth.verifyCode', verifyCode, {});


function createCode(memberId, cb) {
  server.methods.member.createLoginCode(memberId, function(err, result) {
    if(err) {
      log.error({ err: err, member: memberId}, 'error creating code');
      return cb(err);
    }

    var member = result.member;
    var loginCode = result.loginCode;

    log.info({member: memberId, loginCode: loginCode}, 'login code created');

    var message = {
      to: member.name + '<' +member.mails.main + '>',
      subject: '[SINFO] Login code for Deck!',
      text: 'Hey '+member.name+'!\n\n Here is your code for logging in on EventDeck: '+loginCode+'\n\n'+url_prefix+'#/login/'+member.id+'/'+loginCode,
    };

    server.methods.email.send(message, function(err) {
      if(err) {
        log.warn(err);
        log.error({ err: err, member: memberId}, 'error sending code');
        return cb(Boom.internal('error sending email'));
      }
      cb(null, member);
    });
  });
}

function verifyCode(memberId, loginCode, cb) {
  server.methods.member.get(memberId, 'id,loginCodes', function(err, member) {
    if (err) {
      log.error({ err: err, member: memberId}, 'error finding member');
      return cb(err);
    }

    var index = member.loginCodes.map(function (o) {
      return o.code;
    }).indexOf(loginCode);

    if (index === -1 || member.loginCodes[index].created - new Date() > 5*60*1000) {
      log.warn({member: memberId, loginCode: loginCode, loginCodes: member.loginCodes}, '[auth] member tried to login with an invalid code');
      return cb(Boom.unauthorized());
    }

    cb(null, member);
  });
}