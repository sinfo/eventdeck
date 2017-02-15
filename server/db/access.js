const mongoose = require('mongoose')

let schema = new mongoose.Schema({
  member: String,
  thread: String,
  last: Date
})

schema.index({member: 1})

module.exports = mongoose.model('Access', schema)
