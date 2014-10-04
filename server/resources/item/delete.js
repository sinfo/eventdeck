var Item = require('../../db/models/item');
var Notification = require('../../db/models/notification');
var log = require('../../helpers/logger');

module.exports = remove;

function remove(request, reply) {

  Item.del(request.params.id, function(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, item: request.params.id}, '[item] error deleting item');
      return reply({error: 'There was an error deleting the item.'});
    }

    log.info({username: request.auth.credentials.id, item: request.params.id}, '[item] deleted the item');
    reply({success: 'Item deleted.'});
    
    Notification.removeByThread('item-'+request.params.id, function (err) {
      if(err) { 
        log.error({err: err, username: request.auth.credentials.id, item: request.params.id}, '[item] error deleting item notifications');
      }
    });
    
    Notification.removeBySource(request.params.id, function (err) {
      if(err) { 
        log.error({err: err, username: request.auth.credentials.id, item: request.params.id}, '[item] error deleting item notifications');
      }
    });
  });

}
