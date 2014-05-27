var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  color: String
});

tagSchema.statics.findById = function (id, cb) {
  this.find({ id: id }, cb);
};

tagSchema.statics.del = function (id, cb) {
  this.remove({ id: id }, cb);
};

tagSchema.statics.findAll = function (cb) {
  this.find({},cb);
};


var Tag = module.exports = mongoose.model('Tag', tagSchema);
