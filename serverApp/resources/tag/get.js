var Tag = require('../../db/models/tag');

module.exports = get;

function get(request, reply) {

  var tagId = request.params.id;

  Tag.findById(tagId, function(err, result) {
    if (err) {
      return reply({error: 'There was an error getting tag with id \'' + tagId + '\'.'});
    }
    if (!result || result.length < 1) {
      return reply({error: 'Could not find tag with id \'' + tagId + '\'.'});
    }
    
    reply(result[0]);
  });

}
