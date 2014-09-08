var Session = require('../../db/models/session');

module.exports = list;

function list(request, reply) {

  var threadId;

  if (request.path.indexOf('/api/company/') != -1) {
    threadId = 'company-' + request.params.id;
  }
  else if (request.path.indexOf('/api/speaker/') != -1) {
    threadId = 'speaker-' + request.params.id;
  }
  else {
    return reply({error: 'API path unknown.'});
  }

  Session.findByThread(threadId, function(err, result) {
    if (err) {
      return reply({error: 'Error getting sessions from \'' + threadId + '\'.'});
    }
    
    reply(result);
  });
}
