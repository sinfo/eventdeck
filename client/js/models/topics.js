var AmpCollection = require('ampersand-rest-collection');
var topicModel = require('./topic');


module.exports = AmpCollection.extend({
  model: topicModel,
  url: '/api/topics'
});