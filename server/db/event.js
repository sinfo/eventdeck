var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  id: String,
  name: String,
  kind: String,
  description: String,
  date: { type: Date },
  duration: { type: Date },
  updated: { type: Date }
});

var Event = module.exports = mongoose.model('Event', schema);
