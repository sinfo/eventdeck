var AmpCollection = require('ampersand-rest-collection');
var SingleRequest = require('ampersand-collection-single-request-mixin');
var Member = require('./member');


module.exports = AmpCollection.extend({
  model: Member,
  url: '/api/members'
}, SingleRequest);

