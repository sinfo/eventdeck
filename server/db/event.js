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

schema.index({id: 1, date: -1});

var eventModel = module.exports = mongoose.model('Event', schema);
