var Lab = require('lab');
var Code = require('code');

var server = require('../').hapi;

var lab = exports.lab = Lab.script();


var credentials = {
  id: 'john.doe',
  name: 'John Doe',
  participations: [{
    role: 'coordination',
    event: '1000-sinfo'
  }]
};

var speakerA = {
  id: 'mane.das.couves',
  name: 'O Grande Mane das Couves',
};

var changesToA = {
  name: 'O Grandioso Mane das Couves'
};

var id;

lab.experiment('Speaker', function() {

  lab.test('Create', function(done) {
    var options = {
      method: 'POST',
      url: '/api/speakers',
      credentials: credentials,
      payload: speakerA
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(201);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(speakerA.id);
      Code.expect(result.name).to.equal(speakerA.name);

      done();
    });
  });

  lab.test('List all', function(done) {
    var options = {
      method: 'GET',
      url: '/api/speakers',
      credentials: credentials,
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Array);
      Code.expect(result[0].id).to.be.string;
      Code.expect(result[0].name).to.be.string;
      done();
    });
  });

  lab.test('Get one', function(done) {
    var options = {
      method: 'GET',
      url: '/api/speakers/'+speakerA.id,
      credentials: credentials,
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(speakerA.id);
      Code.expect(result.name).to.equal(speakerA.name);

      done();
    });
  });

  lab.test('Update', function(done) {
    var options = {
      method: 'PUT',
      url: '/api/speakers/'+speakerA.id,
      credentials: credentials,
      payload: changesToA
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(speakerA.id);
      Code.expect(result.name).to.equal(changesToA.name);

      done();
    });
  });

  lab.test('Delete', function(done) {
    var options = {
      method: 'DELETE',
      url: '/api/speakers/'+speakerA.id,
      credentials: credentials,
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id).to.equal(speakerA.id);
      Code.expect(result.name).to.equal(changesToA.name);
      done();
    });
  });


});
