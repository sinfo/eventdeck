var Company = require('../../db/models/company');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  Company.findAll(function (err, result) {
    if (err || !result || result.length < 1) {
      log.error({err: (err || 'No companies found')}, '[company] error getting all companies');
      return reply({error: 'Error getting all companies.'});
    }
    
    reply(result);
  });

}
