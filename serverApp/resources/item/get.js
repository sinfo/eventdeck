var Item = require('./../../db/models/item.js');

module.exports = get;

function get(request, reply) {

  Item.findById(request.params.id, function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Unable to find item with id '" + request.params.id + "'."});
    }
  });

}
