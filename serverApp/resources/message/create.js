var Message  = require('./../../db/models/message.js');
var log = require('../../helpers/logger');

exports = module.exports = create;

function create(request, reply) {

  var message    = {};
  message = new Message(request.payload);
  message.save(function (err){
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[message] error creating message', message);
      reply({error:"There was an error! "});
    } else{
      reply(message);
    }
  });
}
