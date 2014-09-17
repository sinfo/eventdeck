var Item = require('../../db/models/item');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Item.findAll(function(err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[item] error listing items');
      return reply({error: 'There was an error getting all the items.'});
    }
    
    reply(result);
  });

}
