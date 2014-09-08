var Tag = require('../../db/models/tag');

module.exports = list;

function list(request, reply) {

  Tag.findAll(function (err, result) {
    if (err) {
      return reply({error: 'There was an error getting all tags.'});
    }
  
    reply(result);
  });

}
