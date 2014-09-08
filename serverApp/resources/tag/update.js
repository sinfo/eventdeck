var async = require('async');
var Tag  = require('../../db/models/tag');

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
    Tag.update({id: request.params.id}, tag, function(err) {
      if (err) {
        cb(err);
      }
      else {
        cb();
      }
    });
  }

  function done(err) {
    if (err) {
      return reply({error: 'There was an error updating the tag.'});
    }
    
    reply({success: 'Tag updated.'});
  }
}
