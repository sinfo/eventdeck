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

var commentA = {  
  thread: 'company-example',
  subthread: 'company-example-subexample',
  text: 'this is an example of a comentary',
};

var changesToA = {
  text: 'This is an example of an example of another example.'
};
var commId;

lab.experiment('Comment', function() {

  lab.test('Create', function(done) {
    var options = {
      method: 'POST',
      url: '/comments',
      credentials: credentials,
      payload: commentA
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(201);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.thread, 'thread').to.equal(commentA.thread);
      Code.expect(result.subthread, 'subthread').to.equal(commentA.subthread);
      Code.expect(result.text, 'text').to.equal(commentA.text);

      commId = result.id.toString();

      done();
    });
  });

  lab.test('List all', function(done) {
    var options = {
      method: 'GET',
      url: '/comments',
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Array);
      Code.expect(result[0].thread, 'thread').to.be.string;
      Code.expect(result[0].subthread, 'subthread').to.be.string;
      Code.expect(result[0].text, 'text').to.be.string;
      done();
    });
  });

  lab.test('Get one', function(done) {
    var options = {
      method: 'GET',
      url: '/comments/'+commId,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.thread, 'thread').to.equal(commentA.thread);
      Code.expect(result.subthread, 'subthread').to.equal(commentA.subthread);
      Code.expect(result.text, 'text').to.equal(commentA.text);

      
      done();
    });
  });

  lab.test('Update', function(done) {
    var options = {
      method: 'PUT',
      url: '/comments/'+commId,
      credentials: credentials,
      payload: changesToA
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.thread, 'thread').to.equal(commentA.thread);
      Code.expect(result.subthread, 'subthread').to.equal(commentA.subthread);
      Code.expect(result.text, 'text').to.equal(changesToA.text);
      
      done();
    });
  });

  lab.test('Delete', function(done) {
    var options = {
      method: 'DELETE',
      url: '/comments/'+commId,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.thread, 'thread').to.equal(commentA.thread);
      Code.expect(result.subthread, 'subthread').to.equal(commentA.subthread);
      Code.expect(result.text, 'text').to.equal(changesToA.text);

      done();
    });
  });


});