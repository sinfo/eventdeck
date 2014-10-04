var Comment = require('./../../db/models/comment.js');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  var commentId = request.params.id;

  Comment.findById(commentId, function(err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[comment] error getting comment');
      return reply({error: 'There was an error getting comment with id \'' + commentId + '\'.'});
    }
    else if (!result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id}, '[comment] could not find the comment with id '+request.params.id);
      return reply(result[0]);
    }
    
    reply({error: 'Could not find comment with id \'' + commentId + '\'.'});
  });

}
