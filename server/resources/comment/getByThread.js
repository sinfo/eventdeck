var Comment = require('./../../db/models/comment.js');
var log = require('../../helpers/logger');

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
    log.error({err: 'API path unknown.', username: request.auth.credentials.id}, '[comment] error getting comments for', request.params.id);
    return reply({error: 'API path unknown.'});
  }

  Comment.findByThread(threadId, function(err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[comment] error getting comments for', request.params.id);
      return reply({error: 'There was an error getting the comments from \'' + threadId + '\'.'});
    }
    
    reply(result);
  });

}
