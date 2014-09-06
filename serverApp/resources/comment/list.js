var Comment = require('./../../db/models/comment.js');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Comment.findAll(function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[comment] error listing all comments');
      return reply({error: 'There was an error getting all comments.'});
    }
    
    reply(result);
  });

}
