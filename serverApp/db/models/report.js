var mongoose = require('mongoose');

var reportSchema = new mongoose.Schema({
  author: String,
  date: { type: Date, default: Date.now }
});

reportSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

reportSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

var Report = module.exports = mongoose.model('Report', reportSchema);
