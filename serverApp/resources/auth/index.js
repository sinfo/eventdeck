var Hapi = require('hapi');
var fenix = require('fenixedu');
var Member = require('./../../db/models/member.js');

exports = module.exports;

exports.login = function login(request, reply) {

  if (request.auth.isAuthenticated) {
    return reply().redirect('/');
  }

  return reply.view('login.html', { url: fenix.auth.getAuthUrl() });
};

exports.facebook = function facebook(request, reply) {

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
