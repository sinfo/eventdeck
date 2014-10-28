var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  author: String,
  title: String,
  description: String,
  attendants: [String],
  date: {type: Date}
});

var Meeting = module.exports = mongoose.model('Meeting', schema);
