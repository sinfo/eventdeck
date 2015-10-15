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

var subscriptionA = {
    thread : 'company-example',
};

lab.experiment('Subscription', function() {

  lab.test('Create', function(done) {
    var options = {
      method: 'POST',
      url: '/api/subscriptions',
      credentials: credentials,
      payload: subscriptionA
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.thread).to.equal(subscriptionA.thread);

      done();
    });

  });

  lab.test('Get one', function(done) {
    var options = {
      method: 'GET',
      url: '/api/subscriptions?thread='+subscriptionA.thread,
      credentials: credentials,
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode, 'statusCode').to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.subscribed, 'subscribed').to.equal(true);

      done();
    });
  });

  lab.test('Delete', function(done) {
    var options = {
      method: 'DELETE',
      url: '/api/subscriptions',
      payload: subscriptionA,
      credentials: credentials,
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode, 'statusCode').to.equal(200);
      Code.expect(result, 'Subscription').to.be.instanceof(Object);
      Code.expect(result.thread, 'Thread').to.equal(subscriptionA.thread);
      done();
    });
  });


});
