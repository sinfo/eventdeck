var Notification = require('./../../db/models/notification.js');

module.exports = list;

function list(request, reply) {

  Notification.findAll(function (err, result) {
    if (err) {
      reply({error: "There was an error getting all the notifications."});
    }
    else if (result && result.length > 0) {
    	reply(result);
    }
    else {
      reply({error: "There are no notifications."});
    }
  });

}
