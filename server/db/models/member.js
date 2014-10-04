var mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({
  id: {type: String, unique: true},
  istId: String,
  name: String,
  roles: [{
    id: String,
    name: String,
    isTeamLeader: Boolean
  }],
  facebook: String,
  facebookId: String,
  skype: String,
  phones: [String],
  mails: Object,
  fenixedu: Object,
  loginCodes: [{
    code: String,
    created: {type: Date}
  }],
  subscriptions: {
    all: Boolean,
    threads: [String]
  }
});

memberSchema.statics.findById = function (id, cb) {
  this.find({ id: id.toLowerCase() }, cb);
};

memberSchema.statics.findByIstId = function (id, cb) {
  this.find({ istId: id }, cb);
};

memberSchema.statics.findByFacebookId = function (id, cb) {
  this.find({ facebookId: id }, cb);
};

memberSchema.statics.findByRole = function (id, cb) {
  this.find({ 'roles.id': id},cb);
};

memberSchema.statics.findTeamLeaders = function (cb) {
  this.find({ 'roles.isTeamLeader': true},cb);
};

memberSchema.statics.findAllRoles = function (cb) {
  this.find().distinct('roles',cb);
};

memberSchema.statics.findSubscribers = function (id, cb) {
  this.find({ $or: [ { 'subscriptions.threads': id }, {'subscriptions.all': true } ] },cb);
};

memberSchema.statics.subscribeThread = function (memberId, thread, cb) {
  this.update({ id: memberId.toLowerCase() }, { $push: { 'subscriptions.threads': thread } }, cb);
};

memberSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

var Member = module.exports = mongoose.model('Member', memberSchema);
