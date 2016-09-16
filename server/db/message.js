var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  chatId: String,
  member: String,
  source: { type: String, default: '' },
  text: String,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Message', schema)
