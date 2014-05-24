var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
  id: String,
  name: String,
  kind: String,
  thread: String,
  place: String,
  description: String,
  speakers: [{
    name: String,
    position: String
  }],
  date: { type: Date },
  duration: { type: Date },
  updated: { type: Date }
});

sessionSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

sessionSchema.statics.del = function (id, cb) {
  this.remove({ _id: id }, cb);
};

sessionSchema.statics.findByThread = function (id, cb) {
  this.find({ thread: id }, cb);
};

sessionSchema.statics.findAll = function (cb) {
  this.find({},cb);
};


var Session = module.exports = mongoose.model('Session', sessionSchema);
