var Member = require('../../db/models/member');

module.exports = remove;

function remove(request, reply) {

  var memberId = request.auth.credentials.id;

  var source = request.url.path.split('/')[2];
  var sourceId = request.url.path.split('/')[3];

  Member.update({id: memberId}, {$pull: {'subscriptions.threads': source + '-' + sourceId}}, function (err) {
    if (err) {
      return reply({error: 'There was an error updating the member.'});
    }
    
    reply({success: 'Member updated.'});
  });

}
