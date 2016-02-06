var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  title: { type: String, default: '' },
  description: String,
  information: String,
  img: String,
  contacts: String,
  participations: [{
    event: String,
    member: String,
    status: String,
    kind: String
  }],
  updated: { type: Date, default: Date.now },
  feedback: String,
  random_sample: Number
});

schema.virtual('thread').get(function () {
  return 'speaker-'+this.id;
});

schema.index({id: 1, updated: -1});
schema.index({'participations.event': 1, updated: -1});
schema.index({'participations.member': 1});
schema.index({'participations.status': 1});

var Speaker = module.exports = mongoose.model('Speaker', schema);
