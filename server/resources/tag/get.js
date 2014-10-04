var Tag = require('../../db/models/tag');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  var tagId = request.params.id;

  Tag.findById(tagId, function(err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, tag: request.params.id}, '[tag] error getting tag');
      return reply({error: 'There was an error getting tag with id \'' + tagId + '\'.'});
    }
    if (!result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id, tag: request.params.id}, '[tag] couldn\'t find tag');
      return reply({error: 'Could not find tag with id \'' + tagId + '\'.'});
    }
    
    reply(result[0]);
  });

}
