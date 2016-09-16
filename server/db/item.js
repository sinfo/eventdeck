var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  description: String,
  img: String,
  price: Number,
  minPrice: Number
})

schema.index({id: 1})

module.exports = mongoose.model('Item', schema)
