var mongoose = require('mongoose');

var communicationSchema = new mongoose.Schema({
  thread: String,
  kind: String,
  member: String,
  text: String,
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

communicationSchema.statics.findByThread = function (id, cb) {
  this.find({ thread: id }, cb);
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
