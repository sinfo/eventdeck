var Member = require('../../db/models/member');
var log = require('../../helpers/logger');

module.exports = get;

function get(request, reply) {

  var memberId = request.auth.credentials.id;

  var source = request.url.path.split('/')[2];
  var sourceId = request.url.path.split('/')[3];
  var thread = source + '-' + sourceId;

  Member.find({id: memberId}, function (err, result) {
    if (err || !result || result.length < 1) {
      log.error({err: err, username: request.auth.credentials.id, thread: thread}, '[subscriptions] error getting member subscriptions');
      return reply({error: 'There was an error getting the member.'});
    }

    var member = result[0];
    if (member.subscriptions.all || member.subscriptions.threads.indexOf(thread) !== -1) {
      reply({success: 'subscribed'});
    }
    else {
      reply({success: 'unsubscribed'});
    }
  });

}
