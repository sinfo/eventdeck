var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  img: String,
  roles: [{
    id: String,
    isTeamLeader: Boolean
  }],
  facebook: {
    id: {type: String, unique: true, sparse: true},
    username: String
  },
  skype: String,
  phones: [String],
  mails: {
    main: String, // previously mails.sinfo
    institutional: String, // previously mails.ist
    dropbox: String,
    google: String,
    microsoft: String // previously mails.msn
  },
  loginCodes: [{
    code: String,
    created: {type: Date}
  }],
  subscriptions: {
    all: Boolean,
    threads: [String]
  }
});

var Member = module.exports = mongoose.model('Member', schema);
