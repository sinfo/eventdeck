var Member = require('../../db/models/member');

module.exports = get;

function get(request, reply) {

  var memberId = request.auth.credentials.id;

  var source = request.url.path.split('/')[2];
  var sourceId = request.url.path.split('/')[3];

  Member.find({id: memberId}, function (err, result) {
    if (err || !result || result.length < 1) {
      return reply({error: 'There was an error getting the member.'});
    }

    var member = result[0];
    if (member.subscriptions.all || member.subscriptions.threads.indexOf(source + '-' + sourceId) !== -1) {
      reply({success: 'subscribed'});
    }
    else {
      reply({success: 'unsubscribed'});
    }
  });

}
