var Member = require('./../../db/models/member.js');
var log = require('../../helpers/logger');

module.exports = login;

function login(request, reply) {
  if (request.auth.isAuthenticated) {
    log.warn('[auth]', request.auth.credentials.id, 'tried to login again with', request.params.id);
    return reply({error: 'You\'re already authenticated'});
  }

  Member.find({id: request.params.id}, function (err, result) {
    if (err || !result || result.length < 1) {
      log.error('[auth] Error finding member', request.params.id, err);
      return reply({error: 'Login failed.'});
    }

    var member = result[0];

    var index = member.loginCodes.map(function (o) {
      return o.code;
    }).indexOf(request.params.code);

    if (index === -1 || member.loginCodes[index].created - Date.now() > 5*60*1000) {
      log.warn('[auth]', request.params.id, 'tried to login with an invalid code', request.params.code, member.loginCodes);
      return reply({error: 'Login failed.'});
    }

    Member.update({id: request.params.id}, {loginCodes: []}, function (err) {
      if (err) {
        log.error('[auth] Error deleting login codes from', request.params.id, err);
        return reply({error: 'Login failed.'});
      }
      
      request.auth.session.set(member);
      log.info('[auth]', request.params.id, 'logged in using code', request.params.code);
      reply({success: 'Logged in.'});
    });

  });
}
