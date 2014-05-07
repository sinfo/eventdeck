var Message = require('./../../db/models/message.js');

exports = module.exports = list;

function list(request, reply) {
  Message.findAll(gotMessage);

  function gotMessage(err, result) {
    if (err)
      reply(err);
    else
      reply(result);
  }
}
