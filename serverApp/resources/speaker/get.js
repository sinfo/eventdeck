var Speaker      = require('../../db/models/speaker');
var notification = require('../notification');

module.exports = get;

function get(request, reply) {

  var speakerId = request.params.id;

  Speaker.findById(speakerId, function (err, result) {
    if (err) {
      return reply({error: 'There was an error getting the speaker.'});
    }
    if (!result || result.length < 1) {
      return reply({error: 'Could not find speaker with id \'' + speakerId + '\'.'});
    }
    
    reply(result[0]);

    notification.read(request.auth.credentials.id, 'speaker-' + speakerId);
  });

}
