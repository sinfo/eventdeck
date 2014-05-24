var Session = require('./../../db/models/session.js');

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
    reply({error: "API path unknown."});
    return;
  }

  Session.findByThread(threadId, function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result);
    }
    else {
      reply({error: "Error getting sessions from '" + threadId + "'."})
    }
  });
}
