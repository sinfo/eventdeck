var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  kind: String, // IDEA, INFO, TODO, DECISION or MEETING
  name: String, // title of the topic
  text: String, // can be markdown
  author: String,

  targets: [String], // people assigned to this topic or attendants if type==MEETING

  closed: {type:Boolean, default: false},

  // only used on if type==DECISION
  poll: {
    kind: {type: String, default: 'text'}, // TEXT or IMAGE
    options: [{
      content: String,
      votes: [String]
    }]
  },
  duedate: {type: Date},

  tags: [String],

  posted: {type: Date},
  updated: {type: Date},
});

schema.virtual('thread').get(function () {
  return 'topic-'+this.id;
});

schema.index({posted: -1});
schema.index({author: 1});

var Topic = module.exports = mongoose.model('Topic', schema);
