var Comment = require('./../../db/models/comment.js');

module.exports = list;

function list(request, reply) {

  Comment.findAll(function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result);
    }
    else {
      reply({error: "There was an error getting all comments."});
    }
  });

}
