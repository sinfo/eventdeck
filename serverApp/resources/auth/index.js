var Hapi    = require('hapi');
var fenix   = require('fenixedu');
var Request = require('request');
var Member  = require('./../../db/models/member.js');

exports = module.exports;

exports.login = function login(request, reply) {

  if (request.auth.isAuthenticated) {
    return reply().redirect('/');
  }

  return reply.view('login.html', { url: fenix.auth.getAuthUrl() });
};

exports.facebook = function facebook(request, reply) {
  if (request.auth.isAuthenticated) {
    return reply().redirect('/');
  }

  Request("https://graph.facebook.com/debug_token?input_token=" + request.url.query.token + "&access_token=457207507744159|dc4e34861edcd5be164c15ff6df29565", {
    method: "GET",
    json: true
  },
  function (error, response, result) {
    if (!error && response.statusCode == 200) {
      console.log(result);
      if (result.data && result.data.app_id === "457207507744159" && result.data.user_id === request.url.query.id) {
        Member.findByFacebookId(request.url.query.id, function(error, result) {
          if (error) {
            reply.view('error.html');
          }
          else if (result && result.length > 0) {
            var account = result[0];

            console.log("FACEBOOK LOG IN", account);

            request.auth.session.set(account);
            reply().redirect('/');
          }
          else {
            reply.view('error.html', {error: "Your ist id is not allowed."});
          }
        });
      }
    }
  });
}

exports.redirect = function redirect(request, reply) {

  if (request.auth.isAuthenticated) {
    return reply().redirect('/');
  }

  var account = null;

  if(request.url.query.error) { return reply.view('error.html', { error: request.url.query.error_description }); }

  fenix.auth.getAccessToken(request.url.query.code, function(error, body) {
    if (error) { return reply.view('error.html'); }

    var refresh_token = body.refresh_token;
    var access_token = body.access_token;

    fenix.person.getPerson(access_token, function(error, person) {
      if (error) { return reply.view('error.html', { error: error.error_description }); }

      var person = JSON.parse(person);

      Member.findByIstId(person.username, function(error, result) {
        if (error) { return reply.view('error.html'); }

        if (result.length > 0) {
          account = result[0];

          console.log("LOG IN", account);

          request.auth.session.set(account);
          return reply().redirect('/');
        }
        else {
          return reply.view('error.html', { error: "Your ist id is not allowed :-(" });
        }
      });
    });
  });
};

exports.logout = function logout(request, reply) {

  request.auth.session.clear();
  return reply().redirect('/');
};
