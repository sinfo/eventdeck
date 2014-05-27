var Tag = require('./../../db/models/tag.js');

module.exports = get;

function get(request, reply) {

  var tagId = request.params.id;

  Tag.findById(tagId, function(err, result) {
    if (err) {
      reply({error: "There was an error getting tag with id '" + tagId + "'."});
    }
    else if (result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Could not find tag with id '" + tagId + "'."});
    }
  });

}
