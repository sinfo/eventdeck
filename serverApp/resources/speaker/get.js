var Speaker      = require('./../../db/models/speaker.js');
var notification = require('./../notification');

module.exports = get;

function get(request, reply) {

  var speakerId = request.params.id;

  Speaker.findById(speakerId, function (err, result) {
    if (err) {
      reply({error: "There was an error getting the speaker."});
    }
    else if (result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Could not find speaker with id '" + speakerId + "'."})
    }

    notification.read(request.auth.credentials.id, 'speaker-' + speakerId);
  });

}
