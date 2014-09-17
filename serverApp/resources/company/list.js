var Company = require('../../db/models/company');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Company.findAll(function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[company] error getting all companies');
      return reply({error: 'Error getting all companies.'});
    }
    
    reply(result);
  });

}
