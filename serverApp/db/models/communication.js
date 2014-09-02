var mongoose = require('mongoose');

var communicationSchema = new mongoose.Schema({
  thread: String,
  event: String,
  kind: String,
  member: String,
  text: String,
  status: String,
  approved: Boolean,
  posted: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

communicationSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

communicationSchema.statics.del = function (id, cb) {
  this.remove({ _id: id }, cb);
};

communicationSchema.statics.findByThread = function (thread, cb) {
  this.find({ thread: thread }, cb);
};

communicationSchema.statics.findByThreadLast = function (id, cb) {
  this.findOne({ thread: id }).sort('-posted').exec(cb);
};

communicationSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

communicationSchema.statics.removeByThread = function (id, cb) {
  this.remove({ thread: id }, cb);
};

communicationSchema.statics.getAllThreads = function (cb) {
  this.distinct('thread', cb);
};


var Communication = module.exports = mongoose.model('Communication', communicationSchema);
