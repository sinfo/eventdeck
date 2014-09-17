var Member = require('../../db/models/member');
var log = require('../../helpers/logger');

module.exports = remove;

function remove(request, reply) {

  var memberId = request.auth.credentials.id;

  var source = request.url.path.split('/')[2];
  var sourceId = request.url.path.split('/')[3];
  var thread = source + '-' + sourceId;

  Member.update({id: memberId}, {$pull: {'subscriptions.threads': thread}}, function (err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, thread: thread}, '[subscriptions] error removing member subscriptions');
      return reply({error: 'There was an error updating the member.'});
    }
    
    log.info({username: request.auth.credentials.id, thread: thread}, '[subscriptions] removed member subscription');
    reply({success: 'Member updated.'});
  });

}
