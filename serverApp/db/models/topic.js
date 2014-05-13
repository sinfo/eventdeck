var mongoose = require('mongoose');

var topicSchema = new mongoose.Schema({
  author: String,
  text: String,
  targets: [String],
  kind: String,
  closed: Boolean,
  votes: [String],
  duedate: {type: Date},
  meeting: [String],
  posted: {type: Date, default: Date.now}
});

topicSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

topicSchema.statics.findByMeeting = function (id, cb) {
  this.find({ meeting: id }, cb);
};

topicSchema.statics.findAll = function (cb) {
  this.find({},cb);
};



var Topic = module.exports = mongoose.model('Topic', topicSchema);