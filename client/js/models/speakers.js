var AmpCollection = require('ampersand-rest-collection');
var SingleRequest = require('ampersand-collection-single-request-mixin');
var PaginationMixin = require('ampersand-pagination-mixin');
var speaker = require('./speaker');


module.exports = AmpCollection.extend({
  model: speaker,
  url: '/api/speakers',
  data: {
    sort: '-updated',
    limit: 30
  }
}, SingleRequest, PaginationMixin);
