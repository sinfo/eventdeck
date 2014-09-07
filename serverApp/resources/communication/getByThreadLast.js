var Communication = require('../../db/models/communication.js');
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
    log.error({err: 'API path unknown.', username: request.auth.credentials.id}, '[communication] error getting communications for', request.params.id);
    return reply({error: 'API path unknown.'});
  }

  Communication.findByThreadLast(request, function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[communication] error getting communications for', request.params.id);
      return reply({error: 'There was an error getting the communications from \'' + threadId + '\'.'});
    }
    
    reply(result);
  });
}
