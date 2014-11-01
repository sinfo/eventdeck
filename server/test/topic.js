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

var topicA = {
  text: 'hey',
  kind: 'Idea',
  author: 'john.doe'
};

var topicAid;

var changesTopicA = {
  text: 'Howdy'
}

lab.experiment('Topic', function() {

  lab.test('Create', function(done) {
    var options = {
      method: 'POST',
      url: '/api/topics',
      credentials: credentials,
      payload: topicA
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(201);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.text).to.equal(topicA.text);
      Code.expect(result.author).to.equal(topicA.author);

      topicAid = result.id.toString();

      done();
    });
  });

  lab.test('List all', function(done) {
    var options = {
      method: 'GET',
      url: '/api/topics',
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Array);
      Code.expect(result[0].id).to.be.string
      Code.expect(result[0].author).to.be.string;
      Code.expect(result[0].text).to.be.string;      
      done();;
    });
  });

  lab.test('Get one', function(done) {
    var options = {
      method: 'GET',
      url: '/api/topics/'+topicAid,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.author).to.equal(topicA.author);   
      Code.expect(result.text).to.equal(topicA.text);
      Code.expect(result.id.toString()).to.equal(topicAid);
      
      done();
    });
  });

  lab.test('Update', function(done) {
    var options = {
      method: 'PUT',
      url: '/api/topics/'+topicAid,
      credentials: credentials,
      payload: changesTopicA
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.text).to.equal(changesTopicA.text);   
      Code.expect(result.author).to.equal(topicA.author); 
      Code.expect(result.id.toString()).to.equal(topicAid);  
      done();
    });
  });

  lab.test('Delete', function(done) {
    var options = {
      method: 'DELETE',
      url: '/api/topics/'+topicAid,
      credentials: credentials,
    };
 
    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(result).to.be.instanceof(Object);
      Code.expect(result.id.toString()).to.equal(topicAid);
      Code.expect(result.author).to.equal(topicA.author);
      Code.expect(result.text).to.equal(changesTopicA.text);
      
      done();
    });
  });

});