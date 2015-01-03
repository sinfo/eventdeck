/*global app*/
var AmpIOCollection = require('ampersand-io-collection');
var PageFetchMixin = require('./notifications');
var notification = require('./notification');
var log = require('bows')('io-notifications');

module.exports = function(socket){

	var model = notification(socket).extend({
		session:{
			unread: ['boolean']
		}
	});

	return AmpIOCollection.extend(socket, PageFetchMixin, {
		events: {
		  fetch: 'notifications-get',
		  onFetch: 'notifications-get-response',
		  onNew: ['notify-target', 'notify-subscription'],
		  count: 'notification-count',
		  onCount: 'notification-count-response',
		  access: 'access'
		},

		listeners: {
			onNew: {
				fn: function(data, cb){
					var callback = function(){if(cb){ cb();}};
					log('Received private notification.');
					log(data);
					if(data.err){
						log(data.err);
						return callback();
					}
					app.me.unreadCount++;
					app.notifications.private.add(data.response, {at: 0});
					callback();
				},
				active: false
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
				active: false
			},
		},
		model: model
	});
};