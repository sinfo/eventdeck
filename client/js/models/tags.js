var AmpCollection = require('ampersand-rest-collection');
var tagModel = require('./tag');


module.exports = AmpCollection.extend({
  model: tagModel,
  url: '/api/tags'
});