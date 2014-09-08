var Comment       = require('./../../db/models/comment');
var Communication = require('./../../db/models/communication');
var Notification  = require('./../../db/models/notification');
var Speaker       = require('./../../db/models/speaker');

module.exports = del;

function del(request, reply) {

  var speakerId = request.params.id;

  if (!checkPermissions()) {
    return reply({error: 'You do not have permissions to delete a speaker.'});
  }

  Speaker.remove({id: speakerId}, function (err) {
  if (err) {
    return reply({error: 'There was an error deleting the speaker.'});
  }

  Comment.removeByThread('speaker-' + speakerId, function (err) {
    // do nothing
  });

  Communication.removeByThread('speaker-' + speakerId, function (err) {
    // do nothing
  });

  Notification.removeByThread('speaker-' + speakerId, function (err) {
    // do nothing
  });

  reply({success: 'Speaker deleted.'});
});


  function checkPermissions() {
    return request.auth.credentials.roles.filter(function (o) {
      return o.id === 'development-team' || o.id === 'coordination';
    }).length > 0;
  }

}
