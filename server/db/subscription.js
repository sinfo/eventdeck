var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  member: String,
  thread: String
});

var Subscription = module.exports = mongoose.model('Subscription', schema);
