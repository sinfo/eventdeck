var mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({
  id: {type: String, unique: true},
  istId: {type: String, unique: true},
  name: String,
  roles: [{
    name: String,
    isTeamLeader: Boolean
  }],
  facebook: String,
  skype: String,
  phones: [String],
  mails: Object,
  fenixedu: Object
});

memberSchema.statics.findById = function (id, cb) {
  this.find({ id: id.toLowerCase() }, cb);
};

memberSchema.statics.findByIstId = function (id, cb) {
  this.find({ istId: id }, cb);
};

memberSchema.statics.findByRole = function (id, cb) {
  this.find({ 'roles.name': id},cb);
};

memberSchema.statics.findTeamLeaders = function (cb) {
  this.find({ 'roles.isTeamLeader': true},cb);
};

memberSchema.statics.findAllRoles = function (cb) {
  this.find().distinct('roles.name',cb);
};

memberSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

var Member = module.exports = mongoose.model('Member', memberSchema);
