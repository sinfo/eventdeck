var mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({
  thread: String,
  member: String,
  description: String,
  unread: [String],
  posted: { type: Date, default: Date.now }
});

notificationSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

notificationSchema.statics.findByThread = function (id, cb) {
  this.find({ thread: id }, cb);
};

notificationSchema.statics.findByMember = function (id, cb) {
  this.find({ member: id }, cb);
};

notificationSchema.statics.findByUnread = function (id, cb) {
  this.find({ unread: id }, cb);
};

notificationSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

 
var Notification = module.exports = mongoose.model('Notification', notificationSchema);