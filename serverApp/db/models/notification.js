var mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({
  thread: String,
  source: String,
  member: String,
  description: String,
  targets: [String],
  unread: [String],
  posted: { type: Date, default: Date.now }
});

notificationSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

notificationSchema.statics.findBySource = function (id, cb) {
  this.find({ source: id }, cb);
};

notificationSchema.statics.removeBySource = function (id, cb) {
  this.remove({ source: id }, cb);
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
  this.find({}, {}, {limit: 20, sort: 'date'}, cb);
};

notificationSchema.statics.findByThread = function (id, cb) {
  this.find({ thread: id }, cb);
};

notificationSchema.statics.findByThreadAndDate = function (id, date, cb) {
  this.find({ thread: id, posted: {$gte: date}, member: 'toolbot' }, cb);
};

notificationSchema.statics.removeByThread = function (id, cb) {
  this.remove({ thread: id }, cb);
};

notificationSchema.statics.readThread = function(memberId, thread, cb) {
  this.update({thread: thread}, { $pull: { unread: memberId } } , { multi: true }, cb);
};

var Notification = module.exports = mongoose.model('Notification', notificationSchema);
