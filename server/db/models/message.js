var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  chatId: String,
  member: String,
  source: { type: String, default: ''},
  text: String,
  date: { type: Date, default: Date.now }
});
 
var Message = module.exports = mongoose.model('Message', schema);