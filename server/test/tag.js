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

var tagA = {
  id: 'im.a.tag',
  name: 'Tagging your post',
  color: 'blue'
};

var changesTagA = {
  name:'updated yer tag',
  color: 'green'
};

lab.experiment('Tag', function() {

  lab.test('Create', function(done) {
    var options = {
      method: 'POST',
      url: '/api/tags',
      credentials: credentials,
      payload: tagA
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(201);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(tagA.id);
      Code.expect(result.name).to.equal(tagA.name);

      done();
    });
  });

  lab.test('List all', function(done) {
    var options = {
      method: 'GET',
      url: '/api/tags',
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Array);
      Code.expect(result[0].id).to.be.string;
      Code.expect(result[0].name).to.be.string;
      Code.expect(result[0].color).to.be.string;      
      done();
    });
  });

  lab.test('Get one', function(done) {
    var options = {
      method: 'GET',
      url: '/api/tags/'+tagA.id,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(tagA.id);
      Code.expect(result.name).to.equal(tagA.name);
      
      done();
    });
  });

  lab.test('Update', function(done) {
    var options = {
      method: 'PUT',
      url: '/api/tags/'+tagA.id,
      credentials: credentials,
      payload: changesTagA
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(tagA.id);
      Code.expect(result.name).to.equal(changesTagA.name);
      Code.expect(result.color).to.equal(changesTagA.color);
      
      done();
    });
  });

  lab.test('Delete', function(done) {
    var options = {
      method: 'DELETE',
      url: '/api/tags/'+tagA.id,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(tagA.id);
      Code.expect(result.name).to.equal(changesTagA.name);
      Code.expect(result.color).to.equal(changesTagA.color);
      
      done();
    });
  });


});