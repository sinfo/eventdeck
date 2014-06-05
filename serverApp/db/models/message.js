var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
  chatId: String,
  member: String,
  kind: { type: String, default: 'message' },
  source: { type: String, default: ''},
  text: String,
  date: { type: Date, default: Date.now }
});

messageSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

messageSchema.statics.findByChatId = function (id, cb) {
  this.find({ chatId: id }, cb);
};

messageSchema.statics.findByMember = function (id, cb) {
  this.find({ member: id }, cb);
};

messageSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

 
var Message = module.exports = mongoose.model('Message', messageSchema);