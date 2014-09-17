var Item = require('../../db/models/item');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  Item.findById(request.params.id, function(err, result) {
    if (err || !result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id, item: request.params.id}, '[item] error getting item');
      return reply({error: 'Unable to find item with id \'' + request.params.id + '\'.'});
    }
    
    reply(result[0]);
  });

}
