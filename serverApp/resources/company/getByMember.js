var Company = require('../../db/models/company');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Company.findByMember(request.params.id, function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[company] error getting companies of %s', request.params.id);
      return reply({error: 'There was an error getting the companies of member \'' + request.params.id + '\'.'});
    }
    
    reply(result);
  });

}
