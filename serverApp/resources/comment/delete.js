var Comment      = require('./../../db/models/comment.js');
var Notification = require('./../../db/models/notification.js');

module.exports = remove;

function remove(request, reply) {

  Comment.del(request.params.id, function (err) {
    if (err) {
      reply({error: "There was an error deleting the comment."});
    }
    else {
      reply({success: "Comment deleted."});

      /*Notification.remove({}, function (err) {
      	// do nothing
      });*/
    }
  });

}
