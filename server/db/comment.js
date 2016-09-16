var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  thread: String,
  subthread: String,
  member: String,
  text: String,
  posted: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
})

schema.index({thread: 1, posted: -1})
schema.index({subthread: 1, posted: -1})
schema.index({member: 1})

module.exports = mongoose.model('Comment', schema)
