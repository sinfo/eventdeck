var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  description: String,
  img: String,
  site: String,
  contacts: String,
  history: String,
  participations: [{
    event: String,
    member: String,
    status: String,
    kind: String,
    payment: {
      price: Number,
      date: String,
      invoice: String,
      status: String,
      via: String
    },
    advertisementLvl: String,
    items: [{
      id: String,
      amount: Number,
      kind: String
    }]
  }],
  area: String,
  accesses: [{
    date: Date,
    where: String
  }],
  updated: Date
});

schema.virtual('thread').get(function () {
  return 'company-'+this.id;
});

schema.index({id: 1, updated: -1});
schema.index({'participations.event': 1, updated: -1});
schema.index({'participations.member': 1});
schema.index({'participations.status': 1});

var Company = module.exports = mongoose.model('Company', schema);
