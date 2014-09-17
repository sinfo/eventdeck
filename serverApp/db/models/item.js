var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  description: String,
  img: String,
  price: Number,
  minPrice: Number
});

itemSchema.statics.findById = function (id, cb) {
  this.find({id: id }, cb);
};

itemSchema.statics.del = function (id, cb) {
  this.remove({ id: id }, cb);
};

itemSchema.statics.findAll = function (cb) {
  this.find({}, cb);
};

var Item = module.exports = mongoose.model('Item', itemSchema);
