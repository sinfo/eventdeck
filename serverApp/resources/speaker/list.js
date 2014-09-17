var Speaker = require('../../db/models/speaker');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Speaker.findAll(function (err, result) {
    if (err){
      log.error({err: err, username: request.auth.credentials.id}, '[speaker] error getting all speakers');
      return reply({error: 'There was an error getting all speakers.'});
    }

    reply(result);
  });

}
