var AmpCollection = require('ampersand-rest-collection')
var SingleRequest = require('ampersand-collection-single-request-mixin')
var PaginationMixin = require('ampersand-pagination-mixin')
var Member = require('./member')

module.exports = AmpCollection.extend({
  model: Member,
  url: '/api/members',
  data: {
    sort: 'id',
    limit: 30
  },
  initialize: function () {
    this.url += '?event=' + app.me.selectedEvent
  }
}, SingleRequest, PaginationMixin)
