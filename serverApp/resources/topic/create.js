var Topic         = require('../../db/models/topic');
var notification  = require('../notification');
var log = require('../../helpers/logger');

module.exports = create;

function create(request, reply) {

  var topic = request.payload;

  topic.posted = Date.now();
  topic.author = request.auth.credentials.id;

  var newTopic = new Topic(topic);

  newTopic.save(function (err){
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, topic: topic}, '[topic] error creating topic');
      return reply({error: 'There was an error creating the topic.'});
    }

    log.info({username: request.auth.credentials.id, topic: topic._id}, '[topic] new topic created');
    reply({success: 'Topic created.', id: newTopic._id});

    notification.notify(request.auth.credentials.id, 'topic-'+newTopic._id, 'created a new topic', null);
  });

}
