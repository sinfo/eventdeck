var Hapi = require('hapi');
var fenix = require('fenixedu');

var users = {
  ist175328: {},
  ist175401: {},
  ist175993: {},
  ist167024: {},
  ist170179: {}
};

exports = module.exports;

exports.login = function login(request, reply) {

  if (request.auth.isAuthenticated) {
    return reply().redirect('/');
  }

  return reply.view('login.html', { url: fenix.auth.getAuthUrl() });
};

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
    
      console.log("PERSON", person);
      
      var person = JSON.parse(person);
      account = users[person.username];

      if (!account) { return reply.view('error.html', { error: "Your ist id is not allowed :-(" }); }
      
      request.auth.session.set(account);
      return reply().redirect('/');;
    });
  });
};

exports.logout = function logout(request, reply) {

  request.auth.session.clear();
  return reply().redirect('/');
};
