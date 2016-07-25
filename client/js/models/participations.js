var AmpCollection = require('ampersand-collection')
var SingleRequest = require('ampersand-collection-single-request-mixin')
var Participation = require('./participation')

module.exports = AmpCollection.extend({
  model: Participation
}, SingleRequest)
