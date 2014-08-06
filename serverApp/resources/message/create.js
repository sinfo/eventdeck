var Message  = require('./../../db/models/message.js');

exports = module.exports = create;

function create(request, reply) {

  var message    = {};
  message = new Message(request.payload);
  message.save(function (err){
    if (err) {
      console.log(err);
      reply({error:"There was an error!"});
    } else{
      reply(message);
    }
  });
}
