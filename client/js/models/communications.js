var AmpCollection = require('ampersand-rest-collection');
var communication = require('./communication');

module.exports = function(url) {
  return AmpCollection.extend({
    model: communication,
    url: url,
    comparator: function (o1, o2) {
      return new Date(o1.posted).getTime() < new Date(o2.posted).getTime();
    }
  });
};

