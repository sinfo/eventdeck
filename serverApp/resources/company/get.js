var Company      = require('./../../db/models/company');
var notification = require('./../notification');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  var companyId = request.params.id;

  Company.findById(companyId, function (err, result) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[company] error getting company');
      return reply({error: 'There was an error getting company with id \'' + companyId + '\'.'});
    }
    if (!result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id, company: request.params.id}, '[company] couldn\'t find company');
      return reply({error: 'Could not find company with id \'' + companyId + '\'.'});
    }
      
    reply(result[0]);
    
    notification.read(request.auth.credentials.id, 'company-' + companyId);
  });

}
