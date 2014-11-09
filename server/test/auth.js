var Lab = require('lab');
var Code = require('code');

var server = require('../').hapi;

var lab = exports.lab = Lab.script();


var credentials = {
  id: 'john.doe',
  name: 'John Doe',
  roles: [{
    id: 'development-team',
    isTeamLeader: false
  }],
};

var auth;

lab.experiment('Auth', function() {

  lab.test('Get code', function(done) {
 
    server.methods.auth.createCode(credentials.id, function(err, result) {
      
      Code.expect(err, 'err').to.be.null;
      auth = result;

      done();
    });
  });

  lab.test('Get code', function(done) {
 
    server.methods.auth.verifyCode(credentials.id, auth, function(err, result) {
      
      Code.expect(err, 'err').to.be.null;
      auth = result;

      done();
    });
  });

});