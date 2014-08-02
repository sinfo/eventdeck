var mongoose = require('mongoose');
var mongo_url = require('./../../config').mongo.url;

mongoose.connect(mongo_url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (){
  console.log('Successfuly connected to mongoDB');
});

module.exports = db;
