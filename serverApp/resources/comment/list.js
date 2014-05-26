var Comment = require('./../../db/models/comment.js');

module.exports = list;

function list(request, reply) {

  Comment.findAll(function (err, result) {
    if (err) {
      reply({error: "There was an error getting all comments."});
    }
    else {
      reply(result);
    }
  });

}
