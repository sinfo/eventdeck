var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  thread: String,
  event: String,
  kind: String,
  member: String,
  text: String,
  status: String,
  approved: Boolean,
  posted: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
})

schema.index({thread: 1, posted: -1})
schema.index({event: 1, posted: -1})
schema.index({member: 1})

module.exports = mongoose.model('Communication', schema)
