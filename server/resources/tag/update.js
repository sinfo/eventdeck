var async = require('async');
var Tag  = require('../../db/models/tag');
var log = require('../../helpers/logger');

module.exports = update;

function update(request, reply) {

  var tag = request.payload;

  var savedTag;

  async.series([
    getTag,
    saveTag
  ], done);

  function getTag(cb) {
    Tag.findById(request.params.id, gotTag);

    function gotTag(err, result) {
      if (!err && !result || result.length < 1) {
        savedTag = result[0];
        cb();
      }
      else {
        cb(err);
      }
    }
  }

  function saveTag(cb) {
    Tag.update({id: request.params.id}, tag, cb);
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, tag: request.params.id}, '[tag] error updating tag');
      return reply({error: 'There was an error updating the tag.'});
    }
    
    log.info({username: request.auth.credentials.id, tag: request.params.id}, '[tag] updated tag');
    reply({success: 'Tag updated.'});
  }
}
