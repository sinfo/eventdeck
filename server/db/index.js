var mongoose = require('mongoose')
var mongoUrl = require('../../config').mongo.url
var log = require('../helpers/logger')

mongoose.connect(mongoUrl)
var db = mongoose.connection

db.on('error', function (err) {
  log.error('Connection error:', err)
})

db.once('open', function () {
  log.info('Successfuly connected to mongoDB')
})

module.exports = db
