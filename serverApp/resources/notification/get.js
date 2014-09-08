var Notification = require('../../db/models/notification');

module.exports = get;

function get(request, reply) {

  Notification.findById(request.params.id, function (err, result) {
    if (err) {
      return reply({error: 'There was an error getting the notification.'});
    }
    if (!result || result.length < 1) {
    	return reply(result[0]);
    }
    
    reply({error: 'Could not find the notification.'});
  });

}
