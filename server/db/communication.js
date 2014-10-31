var mongoose = require('mongoose');

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
});

var Communication = module.exports = mongoose.model('Communication', schema);
