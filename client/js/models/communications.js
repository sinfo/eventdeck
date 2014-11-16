// communication Collection - communication-collection.js
var AmpCollection = require('ampersand-rest-collection');
var communication = require('./communication');

module.exports = function(url) {
  return AmpCollection.extend({
    model: communication,
    url: url
  });
};

