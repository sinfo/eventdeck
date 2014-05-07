var mongoose = require('mongoose');

var speakerSchema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  status: String,
  description: String,
  img: String,
  forum: Object,
  contacts: String,
  member: String,
  paragraph: String,
  approved: [String],
  updated: { type: Date, default: Date.now }
});

speakerSchema.statics.findById = function (id, cb) {
  this.find({ id: id }, cb);
};

speakerSchema.statics.findByName = function (id, cb) {
  this.find({ name: id }, cb);
};

speakerSchema.statics.findByMember = function (id, cb) {
  this.find({ member: id }, cb);
};

speakerSchema.statics.findAll = function (cb) {
  this.find({},cb);
};


var Speaker = module.exports = mongoose.model('Speaker', speakerSchema);
