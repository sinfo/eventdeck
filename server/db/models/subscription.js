var mongoose = require('mongoose');

var subscriptionSchema = new mongoose.Schema({
  member: String,
  thread: String
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

var Subscription = module.exports = mongoose.model('Subscription', subscriptionSchema);
