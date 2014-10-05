var mongoose = require('mongoose');

var topicSchema = new mongoose.Schema({
  author: String,
  text: String,
  targets: [String],
  kind: String,
  closed: {type:Boolean, default: false},
  result: String,
  poll: {
    kind: {type: String, default: 'text'},
    options: [{
      content: String,
      votes: [String]
    }]
  },
  duedate: {type: Date},
  meetings: [String],
  tags: [String],
  root: String
});

topicSchema.statics.del = function (id, cb) {
  this.remove({ _id: id }, cb);
};

topicSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

topicSchema.statics.findByMeeting = function (id, cb) {
  this.find({ meetings: {$in: [id]} }, cb);
};

topicSchema.statics.findByTarget = function (id, cb) {
  this.find({ targets: {$in: [id]} }, cb);
};

topicSchema.statics.findByDuedate = function (start, end, cb) {
  this.find({ duedate: {$gte: start, $lt: end} }, cb);
};

topicSchema.statics.findByTag = function (id, cb) {
  this.find({ tags: {$in: [id]} }, cb);
};

topicSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

var Topic = module.exports = mongoose.model('Topic', topicSchema);
