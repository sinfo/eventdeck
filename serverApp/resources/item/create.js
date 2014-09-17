var Item = require('../../db/models/item');
var notification  = require('../notification');
var log = require('../../helpers/logger');

module.exports = create;

function create(request, reply) {

  var item = request.payload;

  item.member = request.auth.credentials.id;

  var newItem = new Item(item);

  newItem.save(function (err){
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, item: newItem}, '[item] error creating new item');
      return reply({error: 'Error creating item.'});
    }
    
    log.info({username: request.auth.credentials.id, item: item.id}, '[item] new item created');
    notification.notify(request.auth.credentials.id, 'item-'+item.id, 'created a new item', null);

    reply({success: 'Item created.'});
  });

}
