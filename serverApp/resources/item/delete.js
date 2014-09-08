var Item = require('../../db/models/item');
var Notification = require('../../db/models/notification');

module.exports = remove;

function remove(request, reply) {

  Item.del(request.params.id, function(err) {
    if (err) {
      return reply({error: 'There was an error deleting the item.'});
    }

    reply({success: 'Item deleted.'});
    
    Notification.removeByThread('item-'+request.params.id, function (err) {
      if(err) { 
        console.log(err); 
      }
    });
    
    Notification.removeBySource(request.params.id, function (err) {
      if(err) { 
        console.log(err); 
      }
    });
  });

}
