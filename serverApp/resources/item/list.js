var Item = require('../../db/models/item');

module.exports = list;

function list(request, reply) {

  Item.findAll(function(err, result) {
    if (err) {
      return reply({error: 'There was an error getting all the items.'});
    }
    
    reply(result);
  });

}
