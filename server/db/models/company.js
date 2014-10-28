var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  description: String,
  img: String,
  url: String,
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

var Company = module.exports = mongoose.model('Company', schema);
