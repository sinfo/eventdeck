var AmpCollection = require('ampersand-rest-collection')
var user = require('./user')

module.exports = function (url) {
  return AmpCollection.extend({
    model: user,
    url: url,
    comparator: 'name'
  })
}
