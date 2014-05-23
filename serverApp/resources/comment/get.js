var Comment = require('./../../db/models/comment.js');

module.exports = get;

function get(request, reply) {

  Comment.findById(request.params.id, function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Unable to find comment with id '" + request.params.id + "'."});
    }
  });

}
