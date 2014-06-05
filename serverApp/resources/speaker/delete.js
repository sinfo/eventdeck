var async         = require("async");
var Comment       = require("./../../db/models/comment");
var Communication = require("./../../db/models/communication");
var Notification  = require("./../../db/models/notification");
var Speaker       = require("./../../db/models/speaker");

module.exports = del;

function del(request, reply) {

  var speakerId = request.params.id;

  if (checkPermissions()) {
    Speaker.remove({id: speakerId}, function (err) {
      if (err) {
        reply({error: "There was an error deleting the speaker."});
      }
      else {
        Comment.removeByThread("speaker-" + speakerId, function (err) {
          // do nothing
        });

        Communication.removeByThread("speaker-" + speakerId, function (err) {
          // do nothing
        });

        Notification.removeByThread("speaker-" + speakerId, function (err) {
          // do nothing
        });

        reply({success: "Speaker deleted."});
      }
    });
  }
  else {
    reply({error: "You do not have permissions to delete a speaker."});
  }

  function checkPermissions() {
    return request.auth.credentials.roles.filter(function (o) {
      return o.id === "development-team" || o.id === "coordination";
    }).length > 0;
  }

}
