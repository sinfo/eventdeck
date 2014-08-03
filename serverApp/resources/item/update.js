var async    = require('async');
var Item  = require('./../../db/models/item.js');

module.exports = update;

function update(request, reply) {

  var item = request.payload;

  var savedItem;

  async.series([
    getItem,
    saveItem
  ], done);

  function getItem(cb) {
    Item.findById(request.params.id, gotItem);

    function gotItem(err, result) {
      if (!err && result && result.length > 0) {
        savedItem = result[0];
        item.updated = Date.now();
        cb();
      }
      else {
        cb(err);
      }
    }
  }

  function saveItem(cb) {
    Item.update({_id: request.params.id}, item, function(err) {
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
      reply({error: "There was an error updating the item."});
    }
    else {
      notification.notify(request.auth.credentials.id, 'item-'+item.id, 'updated an item', null);

      reply({success: "Item updated."});
    }
  }
}
