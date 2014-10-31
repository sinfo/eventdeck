var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  thread: String,
  subthread: String,
  member: String,
  text: String,
  posted: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

var Comment = module.exports = mongoose.model('Comment', schema);
