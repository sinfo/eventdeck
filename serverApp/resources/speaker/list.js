var Speaker = require('./../../db/models/speaker.js');

module.exports = list;

function list(request, reply) {

  Speaker.findAll(function (err, result) {
    if (err){
      reply({error: "There was an error getting all speakers."});
    }
    else if (result && result.length > 0) {
      reply(result);
    }
    else {
      reply({error: "There are no speakers."});
    }
  });

}
