var Tag = require('./../../db/models/tag.js');

module.exports = remove;

function remove(request, reply) {

  Tag.del(request.params.id, function (err) {
    if (err) {
      reply({error: "There was an error deleting the tag."});
    }
    else {
      reply({success: "Tag deleted."});
    }
  });

}
