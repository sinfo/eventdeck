// Member Collection - member-collection.js
var AmpCollection = require('ampersand-rest-collection');
var Member = require('./member');


module.exports = AmpCollection.extend({
  model: Member,
  url: '/api/members'
});