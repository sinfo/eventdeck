var Session = require('../../db/models/session');
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
  else {
    log.error({err: 'API path unknown.', username: request.auth.credentials.id, id: request.params.id, path: request.path}, '[session] error getting sessions');
    return reply({error: 'API path unknown.'});
  }

  Session.findByThread(threadId, function(err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, thread: threadId}, '[session] error getting session');
      return reply({error: 'Error getting sessions from \'' + threadId + '\'.'});
    }
    
    reply(result);
  });
}
