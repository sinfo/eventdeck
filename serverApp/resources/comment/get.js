var Comment = require('./../../db/models/comment.js');

module.exports = get;

function get(request, reply) {

  var commentId = request.params.id;

  Comment.findById(commentId, function(err, result) {
    if (err) {
      reply({error: "There was an error getting comment with id '" + commentId + "'."});
    }
    else if (result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Could not find comment with id '" + commentId + "'."});
    }
  });

}
