const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  members: [String],
  messages: [String],
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Chat', schema)
