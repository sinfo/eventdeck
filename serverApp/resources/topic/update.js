var Topic = require('./../../db/models/topic');

exports = module.exports = update;

function update(request, reply) {

  console.log(request.payload);

  Topic.update({_id: request.payload._id}, request.payload, function (err){
    if (err) {
      console.log("Error updating topic!\n" + err);
      reply({error: "There was an error!"});
    }
    else {
      //notification.new(request.auth.credentials.id, 'topic-'+topic.id, topic.name, "topic",request.auth.credentials.name);
      console.log("Topic updated: " + request.payload._id);
      reply({success: "Topic updated!"});
    }
  });
}
