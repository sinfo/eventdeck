var AmpCollection = require('ampersand-rest-collection');
var eventModel = require('./event');


module.exports = AmpCollection.extend({
  model: eventModel,
  url: '/api/events'
});