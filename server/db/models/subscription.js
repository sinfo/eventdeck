var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  member: String,
  thread: String
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

var Subscription = module.exports = mongoose.model('Subscription', schema);
