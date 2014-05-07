var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
  id: {type: String, unique: true},
  chatId: String,
  member: String,
  text: String,
  date: { type: Date, default: Date.now }
});

messageSchema.statics.findById = function (id, cb) {
  this.find({ id: id }, cb);
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