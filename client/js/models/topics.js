var AmpCollection = require('ampersand-rest-collection')
var SingleRequest = require('ampersand-collection-single-request-mixin')
var PaginationMixin = require('ampersand-pagination-mixin')
var topicModel = require('./topic')

module.exports = AmpCollection.extend({
  model: topicModel,
  url: '/api/topics',
  data: {
    sort: '-updated',
    limit: 30
  }
}, SingleRequest, PaginationMixin)
