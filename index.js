var Hapi = require('hapi');
var fenix = require('fenixedu');

var companies = require('./companies');
var companiesLookup = {};
for (var i = 0; i < companies.length; i++) {
    companiesLookup[companies[i].id] = companies[i];
}

var users = {
  ist175328: {},
  ist175401: {},
  ist175993: {}
};

var home = function (request, reply) {

  reply.view('home.html', {
    companies: toGrid(companies)
  });
};

var company = function (request, reply) {
  var company = companiesLookup[request.params.id];

  if(company.history) {company.history = company.history.replace(/\n/g, '<br>'); }
  if(company.contacts) {company.contacts = company.contacts.replace(/\n/g, '<br>'); }
  reply.view('company.html', {
    name: company.name,
    img: company.img,
    status: company.status,
    history: company.history,
    contacts: company.contacts,
    member: company.member,
    forum: company.forum
  });
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
    { method: 'GET', path: '/company/{id}', handler: company },
    { method: 'GET', path: '/redirect', config: { handler: redirect, auth: { mode: 'try' } } },
    { method: ['GET', 'POST'], path: '/login', config: { handler: login, auth: { mode: 'try' } } },
    { method: 'GET', path: '/logout', config: { handler: logout, auth: true } },
    { method: 'GET', path: '/{path*}', handler: {
      directory: { path: './public', listing: true, index: true }
    } }
  ]);

  server.start();
});

var toGrid = function (data){
    var rows=[],
        step=6,
        i=0,
        L=data.length;
    
    for(; i<L ; i+=step){
        rows.push({cells:data.slice(i,i+step)});
    };

    return rows;
}
