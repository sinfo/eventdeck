var Lab = require('lab');
var Code = require('code');

var server = require('../').hapi;

var lab = exports.lab = Lab.script();


var credentials = {
  id: 'john.doe',
  name: 'John Doe',
  participations: [{
    role: 'development-team',
    event: '1000-sinfo'
  }]
};

var communicationA = {
  thread : 'company-example',
  event : 'John Does promotion',
  kind : 'geral',
  text : 'From this day on Mr.Doe rules the world.'
};

var changesToA = {
  text: 'He has been demoted after all.'
};
var commId;

lab.experiment('Communication', function() {

  lab.test('Create', function(done) {
    var options = {
      method: 'POST',
      url: '/api/communications',
      credentials: credentials,
      payload: communicationA
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(201);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.thread, 'thread').to.equal(communicationA.thread);
      Code.expect(result.event, 'event').to.equal(communicationA.event);
      Code.expect(result.kind, 'kind').to.equal(communicationA.kind);
      Code.expect(result.text, 'text').to.equal(communicationA.text);

      commId = result.id.toString();

      done();
    });
  });

  lab.test('List all', function(done) {
    var options = {
      method: 'GET',
      url: '/api/communications',
      credentials: credentials,
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Array);
      Code.expect(result[0].thread, 'thread').to.be.string;
      Code.expect(result[0].event, 'event').to.be.string;
      Code.expect(result[0].kind, 'kind').to.be.string;
      Code.expect(result[0].text, 'text').to.be.string;
      done();
    });
  });

  lab.test('Get one', function(done) {
    var options = {
      method: 'GET',
      url: '/api/communications/'+commId,
      credentials: credentials,
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.thread, 'thread').to.equal(communicationA.thread);
      Code.expect(result.event, 'event').to.equal(communicationA.event);
      Code.expect(result.kind, 'kind').to.equal(communicationA.kind);
      Code.expect(result.text, 'text').to.equal(communicationA.text);


      done();
    });
  });

  lab.test('Update', function(done) {
    var options = {
      method: 'PUT',
      url: '/api/communications/'+commId,
      credentials: credentials,
      payload: changesToA
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.thread, 'thread').to.equal(communicationA.thread);
      Code.expect(result.event, 'event').to.equal(communicationA.event);
      Code.expect(result.kind, 'kind').to.equal(communicationA.kind);
      Code.expect(result.text, 'text').to.equal(changesToA.text);


      done();
    });
  });

  lab.test('Delete', function(done) {
    var options = {
      method: 'DELETE',
      url: '/api/communications/'+commId,
      credentials: credentials,
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.thread, 'thread').to.equal(communicationA.thread);
      Code.expect(result.event, 'event').to.equal(communicationA.event);
      Code.expect(result.kind, 'kind').to.equal(communicationA.kind);
      Code.expect(result.text, 'text').to.equal(changesToA.text);

      done();
    });
  });


});
