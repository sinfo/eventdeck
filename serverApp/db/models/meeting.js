var mongoose = require('mongoose');

var meetingSchema = new mongoose.Schema({
  author: String,
  title: String,
  description: String,
  attendants: [String],
  notes: [{type: String, text: String, targets: [String]}],
  date: {type: Date, default: Date.now}
});

meetingSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

meetingSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

var Meeting = module.exports = mongoose.model('Meeting', meetingSchema);
