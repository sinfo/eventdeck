var async    = require('async');
var Item  = require('../../db/models/item');
var notification  = require('../notification');
var log = require('../../helpers/logger');

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
      if (err || !result || result.length < 1) {
        return cb(err);
      }

      savedItem = result[0];
      item.updated = Date.now();
      cb();
    }
  }

  function saveItem(cb) {
    Item.update({id: request.params.id}, item, function(err) {
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
      log.error({err: err, username: request.auth.credentials.id, item: request.params.id}, '[item] error updating item');
      return reply({error: 'There was an error updating the item.'});
    }
    
    log.info({username: request.auth.credentials.id, item: request.params.id}, '[item] updated item');
    notification.notify(request.auth.credentials.id, 'item-'+item.id, 'updated an item', null);

    reply({success: 'Item updated.'});
  }
}
