var Boom = require('boom');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var url_prefix = require('config').url;


server.method('auth.createCode', createCode, {});
server.method('auth.verifyCode', verifyCode, {});


function createCode(memberId, cb) {
  server.methods.member.createLoginCode(memberId, function(err, member, loginCode) {
    if(err) {
      return err;
    }
    var message = {
      to: member.name + '<' +member.mails.sinfo + '>',
      subject: '[SINFO] Login code for Deck!',
      text: 'Hey '+member.name+'!\n\n Here is your code for logging in on EventDeck: '+loginCode+'\n\n'+url_prefix+'#/login/'+member.id+'/'+loginCode,
    };

    server.methods.email.send(message, cb)
  });
};

function verifyCode(memberId, loginCode, cb) {
  server.methods.member.get(memberId, 'id,loginCodes', function(err, _member) {
    if (err) {
      log.error({ err: err, tag: id}, 'error updating tag');
      return cb(Boom.internal());
    }
    if (!_member) {
      log.warn({ err: 'not found', tag: id}, 'error updating tag');
      return cb(Boom.notFound());
    }

    var index = member.loginCodes.map(function (o) {
      return o.code;
    }).indexOf(loginCode);

    if (index === -1 || member.loginCodes[index].created - new Date() > 5*60*1000) {
      log.warn({member: memberId, loginCode: loginCode, loginCodes: _member.loginCodes}, '[auth] member tried to login with an invalid code');
      return cb(Boom.unauthorized());
    }

    cb(null, _member);
  });
};