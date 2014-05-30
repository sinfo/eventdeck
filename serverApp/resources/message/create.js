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
      console.log("Message Created: " + message._id);
      reply({message:"Message Created!", messageId: message._id});
    }
  });
}
