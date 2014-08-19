var Comment = require('./../../db/models/comment.js');

module.exports = list;

function list(request, reply) {

  var threadId;

  if (request.path.indexOf('/api/company/') != -1) {
    threadId = 'company-' + request.params.id;
  }
  else if (request.path.indexOf('/api/speaker/') != -1) {
    threadId = 'speaker-' + request.params.id;
  }
  else if (request.path.indexOf('/api/topic/') != -1) {
    threadId = 'topic-' + request.params.id;
  }
  else if (request.path.indexOf('/api/communication/') != -1) {
    threadId = 'communication-' + request.params.id;
  }
  else {
    reply({error: "API path unknown."});
    return;
  }

  Comment.findByThread(threadId, function(err, result) {
    if (err) {
      reply({error: "There was an error getting the comments from '" + threadId + "'."});
    }
    else {
      reply(result);
    }
  });

}
