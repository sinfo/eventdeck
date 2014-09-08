var Topic        = require('../../db/models/topic');
var Notification = require('../../db/models/notification');
var Comment      = require('../../db/models/comment');

module.exports = del;

function del(request, reply) {

  var topicId = request.params.id;

  Topic.del(topicId, function (err) {
    if (err) {
      return reply({error: 'There was an error deleting the topic with id \'' + topicId + '\'.'});
    }

    Notification.removeByThread('topic-'+topicId, function (err) {
      if(err) { 
        console.log(err); 
      }
    });

    Comment.removeByThread('topic-'+topicId, function (err) {
      if(err) { 
        console.log(err); 
      }
    });

    reply({success: 'Topic deleted.'});
  });

}
