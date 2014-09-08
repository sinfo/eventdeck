var Item = require('../../db/models/item');
var notification  = require('../notification');

module.exports = create;

function create(request, reply) {

  var item = request.payload;

  item.member = request.auth.credentials.id;

  var newItem = new Item(item);

  newItem.save(function (err){
    if (err) {
      console.log('Error creating item.');
      return reply({error: 'Error creating item.'});
    }
    
    notification.notify(request.auth.credentials.id, 'item-'+item.id, 'created a new item', null);

    reply({success: 'Item created.'});
  });

}
