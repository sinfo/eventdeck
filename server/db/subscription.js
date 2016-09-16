var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  member: String,
  thread: String
})

schema.index({member: 1})
schema.index({thread: 1})

module.exports = mongoose.model('Subscription', schema)
