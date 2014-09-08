var Item = require('../../db/models/item');

module.exports = get;

function get(request, reply) {

  Item.findById(request.params.id, function(err, result) {
    if (err || !result || result.length < 1) {
      return reply({error: 'Unable to find item with id \'' + request.params.id + '\'.'});
    }
    
    reply(result[0]);
  });

}
