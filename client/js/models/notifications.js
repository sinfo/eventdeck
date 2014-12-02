var AmpCollection = require('ampersand-rest-collection');
var notification = require('./notification');

module.exports = AmpCollection.extend({
  model: notification,
  url: '/api/notifications'
});

