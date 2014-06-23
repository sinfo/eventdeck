var Member         = require("./../../db/models/member.js");
var Request        = require("request");
var facebookConfig = require("./facebookConfig.js");

module.exports = facebook;

function facebook(request, reply) {
  if (request.auth.isAuthenticated) {
    return reply({error: "You're already authenticated"});
  }

  if(!request.url.query.token) {
    return reply({error: "Token not specified"});
  }

  Request("https://graph.facebook.com/debug_token?input_token=" + request.url.query.token + "&access_token=" + facebookConfig.appId + "|" + facebookConfig.appSecret, {
    method: "GET",
    json: true
  },
  function (error, response, result) {
    if (!error && response.statusCode == 200) {
      if (result.data && result.data.app_id === facebookConfig.appId && result.data.user_id === request.url.query.id) {
        Member.findByFacebookId(request.url.query.id, function (error, result) {
          if (!error && result && result.length > 0) {
            var account = result[0];

          console.log(account.name, 'logged in using Facebook');

            request.auth.session.set(account);
            reply({success: "Logged in with Facebook."});
          }
          else {
            reply({error: "Error logging in with Facebook."});
          }
        });
      }
    }
  });
}