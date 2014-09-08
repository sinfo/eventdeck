var Speaker = require('../../db/models/speaker');

module.exports = list;

function list(request, reply) {

  Speaker.findAll(function (err, result) {
    if (err){
      return reply({error: 'There was an error getting all speakers.'});
    }
    if (!result || result.length < 1) {
      return reply({error: 'There are no speakers.'});
    }

    reply(result);
  });

}
