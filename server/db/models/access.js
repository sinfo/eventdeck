var mongoose = require('mongoose');

var accessSchema = new mongoose.Schema({
  member: String,
  thread: String,
  last: Date
});

chatSchema.statics.findByMember = function (member, cb) {
  this.find({member: member }, cb);
};

chatSchema.statics.findByThread = function (thread, cb) {
  this.find({thread: thread }, cb);
};

chatSchema.statics.findAll = function (cb) {
  this.find({}, cb);
};

var access = module.exports = mongoose.model('Access', accessSchema);
