var AmpCollection = require('ampersand-rest-collection')
var session = require('./session')

module.exports = AmpCollection.extend({
  model: session,
  url: '/api/sessions'
})
