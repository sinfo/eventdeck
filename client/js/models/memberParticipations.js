var AmpCollection = require('ampersand-collection');
var SingleRequest = require('ampersand-collection-single-request-mixin');
var MemberParticipation = require('./memberParticipation');


module.exports = AmpCollection.extend({
  mainIndex: 'event',
  model: MemberParticipation
}, SingleRequest);
