var Hapi           = require("hapi");
var fenix          = require("fenixedu");
var Member         = require("./../../db/models/member.js");
var Request        = require("request");
var facebookConfig = require("./facebookConfig.js");

var exports = module.exports;

exports.login = function login(request, reply) {
  if (request.auth.isAuthenticated) {
    reply().redirect("/");
  }
  else {
    reply.view("login.html", { url: fenix.auth.getAuthUrl() });
  }
};

exports.facebook = function facebook(request, reply) {
  if (request.auth.isAuthenticated) {
    return reply().redirect("/");
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

exports.redirect = function redirect(request, reply) {
  if (request.auth.isAuthenticated) {
    return reply().redirect("/");
  }

  if (request.url.query.error) {
    return reply.view("error.html", { error: request.url.query.error_description });
  }

  fenix.auth.getAccessToken(request.url.query.code, function (error, body) {
    if (error) {
      return reply.view("error.html");
    }

    var refresh_token = body.refresh_token;
    var access_token = body.access_token;

    fenix.person.getPerson(access_token, function (error, person) {
      if (error) {
        return reply.view("error.html", { error: error.error_description });
      }

      var person = JSON.parse(person);

      Member.findByIstId(person.username, function (error, result) {
        if (error) {
          return reply.view("error.html");
        }

        if (result.length > 0) {
          var account = result[0];

          console.log(account.name, 'logged in using FenixEdu');

          request.auth.session.set(account);
          return reply().redirect("/");
        }
        else {
          return reply.view("error.html", { error: "Your ist id is not allowed." });
        }
      });
    });
  });
};

exports.logout = function logout(request, reply) {
  request.auth.session.clear();
  reply().redirect("/");
};
