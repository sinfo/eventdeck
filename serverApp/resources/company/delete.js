var Comment       = require('../../db/models/comment');
var Company       = require('../../db/models/company');
var Communication = require('../../db/models/communication');
var Notification  = require('../../db/models/notification');
var log           = require('../../helpers/logger');

module.exports = del;

function del(request, reply) {

  var companyId = request.params.id;

  if (!checkPermissions()) {
    log.warn({username: request.auth.credentials.id}, '[company] %s tried to delete the company %s', request.auth.credentials.id, companyId);
    return reply({error: 'You do not have permissions to delete a company.'});
  }
  
  Company.remove({id: companyId}, function (err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[company] error deleting company %s', companyId);
      return reply({error: 'There was an error deleting the company.'});
    }
    
    Comment.removeByThread('company-' + companyId, function (err) {
      if(err) {
        log.error({err: err, username: request.auth.credentials.id}, '[company] error deleting comments from %s', companyId);
      }
    });

    Communication.removeByThread('company-' + companyId, function (err) {
      if(err) {
        log.error({err: err, username: request.auth.credentials.id}, '[company] error deleting communications from %s', companyId);
      }
    });

    Notification.removeByThread('company-' + companyId, function (err) {
      if(err) {
        log.error({err: err, username: request.auth.credentials.id}, '[company] error deleting notifications from %s', companyId);
      }
    });

    log.info('[company] %s deleted the company %s', request.auth.credentials.id, companyId);

    reply({success: 'Company deleted.'});
  });
  
  function checkPermissions() {
    return request.auth.credentials.roles.filter(function (o) {
      return o.id === 'development-team' || o.id === 'coordination';
    }).length > 0;
  }

}
