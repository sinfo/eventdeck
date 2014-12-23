var AmpCollection = require('ampersand-collection');
var AmpIOMixin = require('ampersand-collection-io-mixin');
var notification = require('./notification');

var events = {
  fetch: 'notifications-get',
  onFetch: 'notification-get-response',
  onNew: ['notify-target', 'notify-subscription']
};

var listeners = {
	onNew: {
		fn: function(data, cb){
			console.log(this);
			console.log(this.prototype);
		},
		active: true
	}
};

module.exports = function(socket){
	var IOMixin = AmpIOMixin.extend(socket, {events: events, listeners: listeners});

	console.log(IOMixin.prototype);
	return AmpCollection.extend(new IOMixin(), {
	  model: notification(socket),
	});
};
