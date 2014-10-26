var mongoose = require('mongoose');
var async    = require('async');

var messageSchema = new mongoose.Schema({
  chatId: String,
  member: String,
  source: { type: String, default: ''},
  text: String,
  date: { type: Date, default: Date.now }
});

messageSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

messageSchema.statics.findByMember = function (id, cb) {
  this.find({ member: id }, cb);
};

messageSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

messageSchema.statics.removeByThread = function (thread, cb) {
  this.find({source: thread}, cb);
};

 
var Message = module.exports = mongoose.model('Message', messageSchema);