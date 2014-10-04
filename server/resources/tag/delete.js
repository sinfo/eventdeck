var Tag = require('../../db/models/tag');
var log = require('../../helpers/logger');

module.exports = remove;

function remove(request, reply) {

  Tag.del(request.params.id, function (err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, tag: request.params.id}, '[tag] error deleting tag');
      return reply({error: 'There was an error deleting the tag.'});
    }
    
    log.info({username: request.auth.credentials.id, tag: request.params.id}, '[tag] deleted the tag');
    reply({success: 'Tag deleted.'});
  });

}
