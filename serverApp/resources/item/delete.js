var Item = require('./../../db/models/item.js');
var Notification = require('./../../db/models/notification.js');

module.exports = remove;

function remove(request, reply) {

  Item.del(request.params.id, function(err) {
    if (err) {
      reply({error: "There was an error deleting the item."});
    }
    else {
      reply({success: "Item deleted."});
      
      Notification.removeByThread('item-'+request.params.id, function (err, result) {
        if(err) { 
          console.log(err); 
        }
      });
      
      Notification.removeBySource(request.params.id, function (err, result) {
        if(err) { 
          console.log(err); 
        }
      });
    }
  });

}
