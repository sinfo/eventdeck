var Comment       = require('../../db/models/comment');
var Company       = require('../../db/models/company');
var Communication = require('../../db/models/communication');
var Notification  = require('../../db/models/notification');
var log           = require('../../helpers/logger');

module.exports = del;

function del(request, reply) {

  var companyId = request.params.id;

  if (!checkPermissions()) {
    log.warn({username: request.auth.credentials.id, company: companyId}, '[company] tried to delete the company');
    return reply({error: 'You do not have permissions to delete a company.'});
  }
  
  Company.remove({id: companyId}, function (err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, company: companyId}, '[company] error deleting company');
      return reply({error: 'There was an error deleting the company.'});
    }
    
    var thread = 'company-' + companyId;
    Comment.removeByThread(thread, function (err) {
      if(err) {
        log.error({err: err, username: request.auth.credentials.id, company: companyId, thread: thread}, '[company] error deleting comments');
      }
    });

    Communication.removeByThread(thread, function (err) {
      if(err) {
        log.error({err: err, username: request.auth.credentials.id, company: companyId, thread: thread}, '[company] error deleting communications');
      }
    });

    Notification.removeByThread(thread, function (err) {
      if(err) {
        log.error({err: err, username: request.auth.credentials.id, company: companyId, thread: thread}, '[company] error deleting notifications');
      }
    });

    log.info({username: request.auth.credentials.id, company: companyId}, '[company] deleted the company');

    reply({success: 'Company deleted.'});
  });
  
  function checkPermissions() {
    return request.auth.credentials.roles.filter(function (o) {
      return o.id === 'development-team' || o.id === 'coordination';
    }).length > 0;
  }

}
