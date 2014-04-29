var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  status: String,
  description: String,
  img: String,
  url: String,
  forum: Object,
  contacts: String,
  history: String,
  member: String,
  participation: Object,
  area: String,
  updated: { type: Date, default: Date.now }
});

companySchema.statics.findById = function (id, cb) {
  this.find({ id: id }, cb);
};

companySchema.statics.findByName = function (id, cb) {
  this.find({ name: id }, cb);
};

companySchema.statics.findByMember = function (id, cb) {
  this.find({ member: id }, cb);
};

companySchema.statics.findAll = function (cb) {
  this.find({},cb);
};

 
var Company = module.exports = mongoose.model('Company', companySchema);