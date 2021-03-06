var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  color: String
})

schema.index({id: 1})

module.exports = mongoose.model('Tag', schema)
