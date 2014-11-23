// communication Collection - communication-collection.js
var AmpCollection = require('ampersand-rest-collection');
var comment = require('./comment');

module.exports = function(url) {
  return AmpCollection.extend({
    model: comment,
    url: url
  });
};

