var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  member: String,
  thread: String,
  last: Date
});

schema.statics.findByMember = function (member, cb) {
  this.find({member: member }, cb);
};

schema.statics.findByThread = function (thread, cb) {
  this.find({thread: thread }, cb);
};

schema.statics.findAll = function (cb) {
  this.find({}, cb);
};

var access = module.exports = mongoose.model('Access', schema);
