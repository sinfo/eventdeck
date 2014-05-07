var Chat = require('./../../db/models/chat.js');

exports = module.exports = list;

function list(request, reply) {
  Chat.findAll(gotChat);

  function gotChat(err, result) {
    if (err)
      reply(err);
    else
      reply(result);
  }
}
