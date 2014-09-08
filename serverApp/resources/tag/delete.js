var Tag = require('../../db/models/tag');

module.exports = remove;

function remove(request, reply) {

  Tag.del(request.params.id, function (err) {
    if (err) {
      return reply({error: 'There was an error deleting the tag.'});
    }
    
    reply({success: 'Tag deleted.'});
  });

}
