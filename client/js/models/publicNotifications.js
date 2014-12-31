/*global app*/
var AmpCollection = require('./notifications');
var AmpIOMixin = require('ampersand-collection-io-mixin');
var notification = require('./notification');
var log = require('bows')('io-notifications');

module.exports = function(socket){
	var IOMixin = AmpIOMixin.extend(socket);

	var events = {
	  fetch: 'notifications-public-get',
	  onFetch: 'notification-public-get-response',
	  onNew: 'notify-public',
	};

	var listeners = {
		onNew: {
			fn: function(data, cb){
				var callback = function(){if(cb){ cb();}};
				log('Received notification.');
				log(data);
				if(data.err){
					log(data.err);
					return callback();
				}
				app.notifications.public.add(data);
				callback();
			},
			active: true
		}
	};

	return AmpCollection(socket).extend(new IOMixin(null, {events: events, listeners: listeners}));
};
