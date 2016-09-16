var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  id: String,
  name: String,
  kind: String,
  description: String,
  public: { type: Boolean, default: false }, // Should it appear on the web site
  date: { type: Date },
  duration: { type: Date },
  updated: { type: Date }
})

schema.index({id: 1, date: -1})

module.exports = mongoose.model('Event', schema)
