var AmpCollection = require('ampersand-rest-collection');
var SingleRequest = require('ampersand-collection-single-request-mixin');
var PaginationMixin = require('ampersand-pagination-mixin');
var Member = require('./member');

//The url parameter is changed when the selected event is available in app.js.
//See fetchInitialData callback.

module.exports = AmpCollection.extend({
  model: Member,
  url: '/api/members',
  data: {
    sort: 'id',
    limit: 30
  }
}, SingleRequest, PaginationMixin);

