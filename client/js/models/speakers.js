var AmpCollection = require('ampersand-rest-collection');
var speaker = require('./speaker');


module.exports = AmpCollection.extend({
  model: speaker,
  url: '/api/speakers'
});