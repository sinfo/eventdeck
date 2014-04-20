var mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({
  id: {type: String, unique: true},
  istId: {type: String, unique: true},
  name: String,
  role: String,
  facebook: String,
  skype: String,
  phones: [String],
  mails: Object
});

memberSchema.statics.findById = function (id, cb) {
  this.find({ id: id.toLowerCase() }, cb);
};

memberSchema.statics.findByIstId = function (id, cb) {
  this.find({ istId: id }, cb);
};

memberSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

 
var Member = module.exports = mongoose.model('Member', memberSchema);