var AmpCollection = require('ampersand-rest-collection');
var SingleRequest = require('ampersand-collection-single-request-mixin');
var speaker = require('./speaker');


module.exports = AmpCollection.extend({
  model: speaker,
  url: '/api/speakers'
}, SingleRequest);
