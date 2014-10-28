var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  members: [String],
  messages: [String],
  date: { type: Date, default: Date.now }
});

var Chat = module.exports = mongoose.model('Chat', schema);
