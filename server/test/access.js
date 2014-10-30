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

var accessA = {
  member: 'john.doe',
  thread: 'company-example',
  last: Date.now
};

var accessId;

lab.experiment('Access', function() {

  lab.test('Saving Access', function(done) {
 
    server.methods.access.save(accessA.member, '/companies', accessA.member, function(err, result) {
      accessId = result.id.toString();
      Code.expect(err, 'err').to.be.null;

      done();
    });
  });

  lab.test('Getting Access', function(done) {
 
    server.methods.access.get(accessA.member, '/companies', accessA.member, function(err, result) {

      Code.expect(err, 'err').to.be.null;
      Code.expect(result.member).to.equal(accessA.member);

      done();
    });
  });

});