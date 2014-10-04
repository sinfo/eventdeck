var Comment = require('./../../db/models/comment.js');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Comment.findByMember(request.params.id, function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[comment] error getting comments by', request.params.id);
      return reply({error: 'There was an error getting the comments of member \'' + request.params.id + '\'.'});
    }
    
    reply(result);
  });

}
