var AmpCollection = require('ampersand-rest-collection');
var comment = require('./comment');

module.exports = function (url) {
  return AmpCollection.extend({
    model: comment,
    url: url,
    comparator: function (o1, o2) {
      return new Date(o2.posted).getTime() - new Date(o1.posted).getTime();
    }
  });
};
