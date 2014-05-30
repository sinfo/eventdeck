var Topic        = require('./../../db/models/topic.js');
var Notification = require('./../../db/models/notification.js');
var Comment      = require('./../../db/models/comment.js');
var Meeting      = require('./../../db/models/meeting.js');

module.exports = del;

function del(request, reply) {

  var topicId = request.params.id;

  Topic.del(topicId, function (err) {
    if (err) {
      reply({error: "There was an error deleting the topic with id '" + topicId + "'."});
    }
    else {
      /*Notification.removeByThread('topic-'+topicId, function (err, result) {
        //console.log("Notifications removed", result);
      });

      Comment.removeByThread('topic-'+topicId, function (err, result) {
        //console.log("Comments removed", result);
      });

      Meeting.removeTopic(topicId, function (err, result) {
        //console.log("Comments removed", result);
      });*/

      reply({success: "Topic deleted."});
    }
  });

}
