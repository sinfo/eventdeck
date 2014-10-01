var Message = require('./../../db/models/message.js');
var log = require('../../helpers/logger');

exports = module.exports = list;

function list(request, reply) {
  Message.findAll(gotMessage);

  function gotMessage(err, result) {
    if (err){
      log.error({err: err, username: request.auth.credentials.id}, '[message] error getting messages');
      reply(err);
    }
    else{
      reply(result);
    }
  }
}
