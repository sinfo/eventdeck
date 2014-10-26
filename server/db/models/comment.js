var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  thread: String,
  subthread: String,
  member: String,
  text: String,
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
  this.find({ $or: [{ thread: id }, { subthread: id } ] }, cb);
};

commentSchema.statics.findByMember = function (id, cb) {
  this.find({ member: id }, cb);
};

commentSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

commentSchema.statics.removeByThread = function (id, cb) {
  this.remove({ $or: [{ thread: id }, { subthread: id } ] }, cb);
};


var Comment = module.exports = mongoose.model('Comment', commentSchema);
