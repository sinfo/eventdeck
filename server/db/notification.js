var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  thread: String,
  source: String,
  member: String,
  description: String,
  targets: [String],
  posted: { type: Date }
})

schema.index({posted: -1})
schema.index({thread: 1})
schema.index({member: 1})

var Notification = module.exports = mongoose.model('Notification', schema)
