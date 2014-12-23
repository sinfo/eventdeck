/*global app*/
var AmpCollection = require('ampersand-collection');
var AmpIOMixin = require('ampersand-collection-io-mixin');
var notification = require('./notification');
var log = require('bows')('io-notifications');

module.exports = function(socket){
	var IOMixin = AmpIOMixin.extend(socket);

	var events = {
	  fetch: 'notifications-get',
	  onFetch: 'notification-get-response',
	  onNew: ['notify-target', 'notify-subscription']
	};

	var listeners = {
		onNew: {
			fn: function(data, cb){
				log('Received notification.', data);
				app.me.notifications++;
				app.notifications.add(data);
				if(cb){
					cb();
				}
			},
			active: true
		}
	};

	return AmpCollection.extend(new IOMixin(null, {events: events, listeners: listeners}), {
	  model: notification(socket),
	});
};
