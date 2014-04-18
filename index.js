var Hapi = require('hapi');
var fenix = require('fenixedu');

var companies = require('./companies')

var users = {
    ist175328: {
        id: 'ist175328',
        access_token: '',
        refresh_token: '',
    },

    ist175401: {
        id: 'ist175401',
        access_token: '',
        refresh_token: '',
    }
};

var home = function (request, reply) {

    reply('<html><head><title>Login page</title></head><body><h3>Welcome '
      + '!</h3><br/><form method="get" action="/logout">'
      + '<input type="submit" value="Logout">'
      + '</form></body></html>');
};

var login = function (request, reply) {

  if (request.auth.isAuthenticated) {
    return reply().redirect('/');
  }

  return reply.view('login.html', { url: fenix.auth.getAuthUrl() });
};

var redirect = function (request, reply) {

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

var logout = function (request, reply) {

    request.auth.session.clear();
    return reply().redirect('/');
};

var options = {
    views: {
        path: 'templates',
        engines: {
            html: 'handlebars'
        },
        partialsPath: 'partials'
    }
};

var server = new Hapi.Server('0.0.0.0', 8765, options);

server.pack.require('hapi-auth-cookie', function (err) {

    server.auth.strategy('session', 'cookie', {
        password: 'secret',
        cookie: 'sid-example',
        redirectTo: '/login',
        isSecure: false
    });

    server.route([
        { method: 'GET', path: '/', config: { handler: home, auth: true } },
        { method: 'GET', path: '/redirect', config: { handler: redirect, auth: { mode: 'try' } } },
        { method: ['GET', 'POST'], path: '/login', config: { handler: login, auth: { mode: 'try' } } },
        { method: 'GET', path: '/logout', config: { handler: logout, auth: true } },
        { method: 'GET', path: '/{path*}', handler: {
            directory: { path: './public', listing: true, index: true }
        } }
    ]);

    server.start();
});