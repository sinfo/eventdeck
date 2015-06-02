var AmpCollection = require('ampersand-rest-collection');
var SingleRequest = require('ampersand-collection-single-request-mixin');
var topicModel = require('./topic');


module.exports = AmpCollection.extend({
  model: topicModel,
  url: '/api/topics'
}, SingleRequest);
