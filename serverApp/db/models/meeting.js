var mongoose = require('mongoose');

var meetingSchema = new mongoose.Schema({
  author: String,
  title: String,
  description: String,
  attendants: [String],
  notes: [String],
  date: {type: Date}
});

meetingSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

meetingSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

var Meeting = module.exports = mongoose.model('Meeting', meetingSchema);
