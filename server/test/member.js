var Lab = require('lab');
var Code = require('code');

var server = require('../').hapi;

var lab = exports.lab = Lab.script();

var memberA = {
  id: 'john.doe',
  name: 'John Doe',
  roles: [{
    id: 'development-team',
    isTeamLeader: false
  }],
};

var changesMemberA = {
  name: 'Jane Doe'
}


var credentials = memberA;

lab.experiment('Members', function() {

  lab.test('Create', function(done) {
    var options = {
      method: 'POST',
      url: '/members',
      credentials: credentials,
      payload: memberA
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(201);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(memberA.id);
      Code.expect(result.name).to.equal(memberA.name);

      done();
    });
  });

  lab.test('List all', function(done) {
    var options = {
      method: 'GET',
      url: '/members',
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Array);
      Code.expect(result[0].id).to.be.string;
      Code.expect(result[0].name).to.be.string;
      Code.expect(result[0].roles).to.be.instanceof(Array);
      
      done();
    });
  });

  lab.test('Get me', function(done) {
    var options = {
      method: 'GET',
      url: '/members/me',
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(credentials.id);
      Code.expect(result.name).to.equal(credentials.name);
      
      done();
    });
  });

  lab.test('Get one', function(done) {
    var options = {
      method: 'GET',
      url: '/members/'+memberA.id,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(memberA.id);
      Code.expect(result.name).to.equal(memberA.name);
      
      done();
    });
  });

  lab.test('Update', function(done) {
    var options = {
      method: 'PUT',
      url: '/members/'+memberA.id,
      credentials: credentials,
      payload: changesMemberA
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(memberA.id);
      Code.expect(result.name).to.equal(changesMemberA.name);
      
      done();
    });
  });

  lab.test('Delete', function(done) {
    var options = {
      method: 'DELETE',
      url: '/members/'+memberA.id,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(memberA.id);
      Code.expect(result.name).to.equal(changesMemberA.name);
      
      done();
    });
  });


});