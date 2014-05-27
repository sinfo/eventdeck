var async = require('async');
var Tag  = require('./../../db/models/tag.js');

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
      if (!err && result && result.length > 0) {
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
      reply({error: "There was an error updating the tag."});
    }
    else {
      reply({success: "Tag updated."});
    }
  }
}
