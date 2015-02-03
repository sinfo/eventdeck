var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  title: { type: String, default: '' },
  description: String,
  history: String,
  img: String,
  contacts: String,
  participations: [{
    event: String,
    member: String,
    status: String,
    kind: String
  }],
  updated: { type: Date, default: Date.now }
});

schema.virtual('thread').get(function () {
  return 'speaker-'+this.id;
});

var Speaker = module.exports = mongoose.model('Speaker', schema);
