var Topic = require('./../../db/models/topic');

module.exports = update;

function update(request, reply) {

  Topic.update({_id: request.payload._id}, request.payload, function (err) {
    if (err) {
      reply({error: "There was an error updating the topic with id '" + request.payload._id + "'."});
    }
    else {
      reply({success: "Topic updated."});
    }
  });

}
