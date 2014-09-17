var Request        = require('request');
var Member         = require('../../db/models/member');
var facebookConfig = require('../../../config').facebook;
var log            = require('../../helpers/logger');

module.exports = facebook;

function facebook(request, reply) {
  if (request.auth.isAuthenticated) {
    log.warn('[auth]', request.auth.credentials.id, 'tried to login again');
    return reply({error: 'You\'re already authenticated'});
  }

  if(!request.url.query.token) {
    log.warn('[auth] Someone tried to login using facebook without token');
    return reply({error: 'Token not specified'});
  }

  Request('https://graph.facebook.com/debug_token?input_token=' + request.url.query.token + '&access_token=' + facebookConfig.appId + '|' + facebookConfig.appSecret, {
    method: 'GET',
    json: true
  },
  function (error, response, result) {
    if (error || response.statusCode != 200) {
      log.error('[auth] Error logging in with facebook', request.url.query.id, error || ('statusCode:'+response.statusCode));
      return reply({error: 'Error logging in with Facebook'});
    }

    if (!result.data || result.data.app_id !== facebookConfig.appId || result.data.user_id !== request.url.query.id) {
      log.error('[auth] Error logging in with facebook', {
        'result-app-id': result.data.app_id,
        'config-app-id': facebookConfig.appId,
        'result-user-id': result.data.user_id,
        'requested-user-id': request.url.query.id,        
      });
      return reply({error: 'Error logging in with Facebook.'});
    }     
  
    Member.findByFacebookId(request.url.query.id, function (err, result) {
      if (err || !result || result.length < 1) {
        log.error({err: err, facebookId: request.url.query.id}, '[auth] Couldn\'t find members with facebook id');
        return reply({error: 'Error logging in with Facebook.'});
      }

      var account = result[0];
      log.info('[auth]', account.name, 'logged in using Facebook');
      request.auth.session.set(account);
      reply({success: 'Logged in with Facebook.'});
    }); 
  });
}