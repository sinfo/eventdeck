var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  thread: String,
  source: String,
  member: String,
  description: String,
  targets: [String],
  posted: { type: Date, default: Date.now }
});

var Notification = module.exports = mongoose.model('Notification', schema);
