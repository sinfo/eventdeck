var Comment = require('./../../db/models/comment.js');

module.exports = list;

function list(request, reply) {

  Comment.findByMember(request.params.id, function (err, result) {
    if (err) {
      reply({error: "There was an error getting the comments of member '" + request.params.id + "'."});
    }
    else {
      reply(result);
    }
  });

}
