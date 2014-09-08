var async         = require('async');
var Speaker       = require('../../db/models/speaker');
var Member        = require('../../db/models/member');
var Communication = require('../../db/models/communication');

module.exports = get;

function get(request, reply) {

  var speakerId = request.params.id;
  var speaker   = {};
  var member    = {};
  var signature = '';

  async.series([
    getSpeaker,
    getCommunications,
    getMember
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

  function getMember(cb) {
    Member.findById(speaker.member, gotMember);

    function gotMember(err, result) {
      if (err) {
        return cb(err);
      }
      else if (!result || result.length < 1) {
        return cb('Could not find member with id \'' + speaker.member + '\'.');
      }

      member = result[0];
      signature = '<table style=\'color: rgb(0, 0, 0); font-family:helvetica,arial;font-size:13px;\'><tbody><tr><td style=\'font-family: arial, sans-serif; margin: 0px;\'><a href=\'http://www.facebook.com/sinfoist\' target=\'_blank\'><img src=\'http://static.sinfo.org/SINFO_21/Assinatura/facebook.png\' /></a> <br /><a href=\'http://www.twitter.com/sinfo_ist\' target=\'_blank\'><img src=\'http://static.sinfo.org/SINFO_21/Assinatura/twitter.png\' /></a> <br /><a href=\'http://www.youtube.com/sinfoist\' target=\'_blank\'><img src=\'http://static.sinfo.org/SINFO_21/Assinatura/youtube.png\' /></a> <br /><a href=\'mailto:geral@sinfo.org\' target=\'_blank\'><img src=\'http://static.sinfo.org/SINFO_21/Assinatura/email.png\' /></a></td><td style=\'font-family: arial, sans-serif; margin: 0px; padding: 0px 10px;\'><a href=\'http://sinfo.org/\' target=\'_blank\'><img src=\'http://static.sinfo.org/SINFO_21/Assinatura/Logo%20Fundo%20Branco.png\' width=\'125px\' /></a></td><td style=\'font-family: arial, sans-serif; margin: 0px;\'><b>'+member.name+'</b> <br />'+member.roles[0].name+'<br /><a href=\'mailto:'+member.mails.sinfo+'\' target=\'_blank\'>'+member.mails.sinfo+'</a> <br />(+351) '+member.phones[0].split(' (')[0]+' </td></tr></tbody></table>';
      cb();
    }
  }

  function done(err) {
    if (err) {
      return reply.view('error.html', { error: 'There was an error.' });
    }

    reply.view('speakerTemplate.html', {
      signature: signature,
      speaker: speaker
    });
  }

}
