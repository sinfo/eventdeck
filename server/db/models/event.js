var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  id: String,
  name: String,
  kind: String,
  description: String,
  date: { type: Date },
  duration: { type: Date },
  updated: { type: Date }
});

eventSchema.statics.findById = function (id, cb) {
  this.find({ id: id }, cb);
};

eventSchema.statics.del = function (id, cb) {
  this.remove({ id: id }, cb);
};

eventSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

eventSchema.statics.findLast = function (cb) {
  this.find().sort('-date').limit(1).exec(cb);
};


var Event = module.exports = mongoose.model('Event', eventSchema);
