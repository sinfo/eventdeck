var Tag = require('./../../db/models/tag.js');

module.exports = list;

function list(request, reply) {

  Tag.findAll(function (err, result) {
    if (err) {
      reply({error: "There was an error getting all tags."});
    }
    else {
      reply(result);
    }
  });

}
