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

var notificationA = {  
  thread: 'company-example',
  member: 'john.doe',
  description: 'example offered us some cookies and cake',
};


var changesToA = {
  description: 'and some juice'
};

var notificationAid;

lab.experiment('Notification', function() {

  lab.test('Create', function(done) {
    var options = {
      method: 'POST',
      url: '/api/notifications',
      credentials: credentials,
      payload: notificationA
    };
 
    server.methods.notification.create(notificationA , function(err, result) {

      Code.expect(err, 'err').to.be.null;
      Code.expect(result, 'notification').to.be.instanceof(Object);
      Code.expect(result.thread, 'thread').to.equal(notificationA.thread);
      Code.expect(result.member, 'member').to.equal(notificationA.member);
      Code.expect(result.description, 'description').to.equal(notificationA.description);

      notificationAid = result._id.toString();

      done();
    });
  });

  lab.test('List all', function(done) {
    var options = {
      method: 'GET',
      url: '/api/notifications',
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Array);
      Code.expect(result[0].thread).to.be.string;
      Code.expect(result[0].member).to.be.string;
      Code.expect(result[0].description).to.be.string;

      done();
    });
  });

  lab.test('Get one', function(done) {
    var options = {
      method: 'GET',
      url: '/api/notifications/'+notificationAid,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.thread).to.equal(notificationA.thread);
      Code.expect(result.member).to.equal(notificationA.member);
      Code.expect(result.description).to.equal(notificationA.description);

      done();
    });
  });

  lab.test('Delete', function(done) {
    var options = {
      method: 'DELETE',
      url: '/api/notifications/'+notificationAid,
      credentials: credentials,
    };
 
    server.methods.notification.removeByThread('/companies',notificationAid, function(err,result) {
      
      Code.expect(err).to.be.null;

      done();
    });
  });


});