var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  color: String
});

var Tag = module.exports = mongoose.model('Tag', schema);
