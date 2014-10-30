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

var companyA = {  
  id: 'sinfo',
  name: 'SINFO XXII',
};


var changesToA = {
  name: 'SINFO XXIII'
};

lab.experiment('Company', function() {

  lab.test('Create', function(done) {
    var options = {
      method: 'POST',
      url: '/companies',
      credentials: credentials,
      payload: companyA
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(201);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(companyA.id);
      Code.expect(result.name).to.equal(companyA.name);

      done();
    });
  });

  lab.test('List all', function(done) {
    var options = {
      method: 'GET',
      url: '/companies',
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Array);
      Code.expect(result[0].name).to.be.string;
      done();
    });
  });

  lab.test('Get one', function(done) {
    var options = {
      method: 'GET',
      url: '/companies/'+companyA.id,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(companyA.id);
      Code.expect(result.name).to.equal(companyA.name);
      
      done();
    });
  });

  lab.test('Update', function(done) {
    var options = {
      method: 'PUT',
      url: '/companies/'+companyA.id,
      credentials: credentials,
      payload: changesToA
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(companyA.id);
      Code.expect(result.name).to.equal(changesToA.name);
      
      done();
    });
  });

  lab.test('Delete', function(done) {
    var options = {
      method: 'DELETE',
      url: '/companies/'+companyA.id,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(companyA.id);
      Code.expect(result.name).to.equal(changesToA.name); 
      done();
    });
  });


});