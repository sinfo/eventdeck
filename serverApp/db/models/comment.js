var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  id: String,
  thread: String,
  member: String,
  markdown: String,
  html: String,
  posted: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

commentSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

commentSchema.statics.del = function (id, cb) {
  this.remove({ _id: id }, cb);
};

commentSchema.statics.findByThread = function (id, cb) {
  this.find({ thread: id }, cb);
};

commentSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

 
var Comment = module.exports = mongoose.model('Comment', commentSchema);