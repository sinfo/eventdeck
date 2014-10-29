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

var itemA = {  
  id: 'painting',
  name: 'Mona Lisa',
};

var changesToA = {
  name: 'Guernica'
};

lab.experiment('Item', function() {

  lab.test('Create', function(done) {
    var options = {
      method: 'POST',
      url: '/items',
      credentials: credentials,
      payload: itemA
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(201);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.name).to.equal(itemA.name);

      done();
    });
  });

  lab.test('List all', function(done) {
    var options = {
      method: 'GET',
      url: '/items',
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Array);
      Code.expect(result[0].name).to.be.name;
      done();
    });
  });

  lab.test('Get one', function(done) {
    var options = {
      method: 'GET',
      url: '/items/'+itemA.id,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.name).to.equal(itemA.name);
      
      done();
    });
  });

  lab.test('Update', function(done) {
    var options = {
      method: 'PUT',
      url: '/items/'+itemA.id,
      credentials: credentials,
      payload: changesToA
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.name).to.equal(changesToA.name);
      
      done();
    });
  });

  lab.test('Delete', function(done) {
    var options = {
      method: 'DELETE',
      url: '/items/'+itemA.id,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.name).to.equal(changesToA.name); 
      done();
    });
  });


});