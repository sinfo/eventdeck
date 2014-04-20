var mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  img: String,
  url: String
});

memberSchema.statics.findById = function (id, cb) {
  this.find({ id: id }, cb);
};

memberSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

 
var Member = module.exports = mongoose.model('Member', memberSchema);