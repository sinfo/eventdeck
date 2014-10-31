var mongoose = require('mongoose');

var schema = new mongoose.Schema({
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
  root: String,
  updated: {type: Date},
});

var Topic = module.exports = mongoose.model('Topic', schema);
