var mongoose = require('mongoose');
var async    = require('async');

var messageSchema = new mongoose.Schema({
  chatId: String,
  member: String,
  kind: { type: String, default: 'message' },
  source: { type: String, default: ''},
  text: String,
  date: { type: Date, default: Date.now }
});

messageSchema.statics.findById = function (id, cb) {
  this.find({ _id: id }, cb);
};

messageSchema.statics.findByChatId = function (id, now, cb) {
  var date;
  var messages = [];
  var schema = this;
  async.series([
    getFirst,
    getMessages,
  ], function(){
    cb(messages);
  });

  function getFirst(callback){
    schema.findOne({ chatId: id, date: {$lt: now} }).sort('-date').exec(function(err, result) {
      if (err) callback(err);
      date = result.date;
      messages.push(result);
      callback();
    });
  }
  
  function getMessages(callback){
    schema.find({ chatId: id, date: {$lt: date} }).sort('-date').limit(20).exec(function(err, result) {
      if (err) callback(err);
      messages = messages.concat(result);
      callback();
    });
  }


};

messageSchema.statics.findByMember = function (id, cb) {
  this.find({ member: id }, cb);
};

messageSchema.statics.findAll = function (cb) {
  this.find({},cb);
};

messageSchema.statics.removeByThread = function (thread, cb) {
  this.remove({source: thread}, cb);
}

messageSchema.statics.removeByText = function (thread, text, cb) {
  if(thread){
    this.remove({source: thread, text: new RegExp(text, 'i')}, cb); 
  }
  else{
    this.remove({text: new RegExp(text, 'i')}, cb); 
  }
}

messageSchema.statics.removeById = function (id, cb) {
  this.remove({_id: id}, cb);
}

 
var Message = module.exports = mongoose.model('Message', messageSchema);