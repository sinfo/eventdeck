var Topic         = require('./../../db/models/topic.js');
var notification  = require('./../notification');

module.exports = create;

function create(request, reply) {

  var topic = request.payload;

  topic.posted = Date.now();
  topic.author = request.auth.credentials.id;

  var newTopic = new Topic(topic);

  newTopic.save(function (err){
    if (err) {
      reply({error: "There was an error creating the topic."});
    }
    else {
      notification.new(request.auth.credentials.id, "topic-"+newTopic.id, null, "["+newTopic.kind+"]", request.auth.credentials.name);
      reply({success: "Topic created.", id: newTopic._id});
    }
  });

}
