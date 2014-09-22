var async         = require('async');
var Speaker       = require('../../db/models/speaker');
var Member        = require('../../db/models/member');
var Communication = require('../../db/models/communication');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  var speakerId = request.params.id;
  var speaker   = {};

  async.series([
    getSpeaker,
    getCommunications,
    // getMember
  ], done);

  function getSpeaker(cb) {
    Speaker.findById(speakerId, gotSpeaker);

    function gotSpeaker(err, result) {
      if (err) {
        return cb(err);
      }
      if (!result || result.length < 1) {
        return cb('Could not find speaker with id \'' + speakerId + '\'.');
      }
      
      speaker = result[0];
      cb();
    }
  }

  function getCommunications(cb) {
    Communication.findByThread('speaker-'+speakerId, gotCommunications);

    function gotCommunications(err, result) {
      if (err) {
        return cb(err);
      }

      var paragraphCommunication = result.filter(function(o) {
        return o.kind.indexOf('Paragraph') != -1;
      })[0];

      speaker.paragraph = '';
      if(paragraphCommunication) {
        speaker.paragraph = paragraphCommunication.text.replace('\n','<br>');
      }

      cb();
    }
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, speaker: request.params.id}, '[speaker] error previewing initial email');
      return reply.view('error.html', { error: 'There was an error.' });
    }

    log.info({username: request.auth.credentials.id, speaker: request.params.id}, '[speaker] sent inital email');
    reply.view('speakerTemplate.html', {
      speaker: speaker
    });
  }

}
