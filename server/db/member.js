var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  img: String,
  participations: [{
    event: String,
    role: String
  }],
  facebook: {
    id: {type: String, unique: true, sparse: true},
    username: String
  },
  twitter: String,
  github: String,
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
  },
  unreadAccess: { type: Date, default: Date.now }
})

schema.index({id: 1})
schema.index({'participations.role': 1})
schema.index({'facebook.id': 1})

var Member = module.exports = mongoose.model('Member', schema)
