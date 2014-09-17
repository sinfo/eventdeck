var Speaker      = require('../../db/models/speaker');
var notification = require('../notification');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  var speakerId = request.params.id;

  Speaker.findById(speakerId, function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[speaker] error getting speaker');
      return reply({error: 'There was an error getting the speaker.'});
    }
    if (!result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id, speaker: request.params.id}, '[speaker] couldn\'t find speaker');
      return reply({error: 'Could not find speaker with id \'' + speakerId + '\'.'});
    }
    
    reply(result[0]);

    notification.read(request.auth.credentials.id, 'speaker-' + speakerId);
  });

}
