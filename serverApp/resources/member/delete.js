var Member = require('../../db/models/member');
var log = require('../../helpers/logger');

module.exports = del;

function del(request, reply) {

  Member.remove({id: request.params.id}, function (err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, member: request.params.id}, '[member] error deleting member');
      return reply({error: 'There was an error deleting the member.'});
    }
    
    log.info({username: request.auth.credentials.id, member: request.params.id}, '[member] deleted the member');
    reply({success: 'Member deleted.'});
  });

}
