var AmpCollection = require('ampersand-rest-collection');
var SingleRequest = require('ampersand-collection-single-request-mixin');
var company = require('./company');


module.exports = AmpCollection.extend({
  model: company,
  url: '/api/companies'
}, SingleRequest);
