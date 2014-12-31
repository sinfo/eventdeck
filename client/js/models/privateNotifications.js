/*global app*/
var AmpCollection = require('./notifications');
var AmpIOMixin = require('ampersand-collection-io-mixin');
var notification = require('./notification');
var log = require('bows')('io-notifications');

module.exports = function(socket){
	var IOMixin = AmpIOMixin.extend(socket);

	var events = {
	  fetch: 'notifications-get',
	  onFetch: 'notification-get-response',
	  onNew: ['notify-target', 'notify-subscription'],
	  count: 'notification-count',
	  onCount: 'notification-count-response',
	  access: 'access'
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
				app.me.unreadCount++;
				app.notifications.private.add(data);
				callback();
			},
			active: true
		},
		onCount: {
			fn: function(data, cb){
				var callback = function(){if(cb){ cb();}};
				log('Received notification count.');
				if(data.err){
					log(data.err);
					return callback();
				}
				app.me.unreadCount = data.response;
				callback();
			},
			active: true
		}
	};

	return AmpCollection(socket).extend(new IOMixin(null, {events: events, listeners: listeners}));
};
