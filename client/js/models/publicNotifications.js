/*global app*/
var AmpIOCollection = require('ampersand-io-collection');
var PageFetchMixin = require('./notifications');
var notification = require('./notification');
var log = require('bows')('io-notifications');

module.exports = function(socket){

	var model = notification(socket);
	
	return AmpIOCollection.extend(socket, PageFetchMixin, {
		events: {
		  fetch: 'notifications-public-get',
		  onFetch: 'notifications-public-get-response',
		  onNew: 'notify-public',
		},

		listeners: {
			onNew: {
				fn: function(data, cb){
					var callback = function(){if(cb){ cb();}};
					log('Received public notification.');
					log(data);
					if(data.err){
						log(data.err);
						return callback();
					}
					app.notifications.public.add(data.response);
					callback();
				},
				active: false
			},
			onFetch: {
				fn: function(data, cb){
					var callback = function(){if(cb){ cb();}};
					log('Fetched public notifications.');
					log(data);
					if(data.err){
						log(data.err);
						return callback();
					}
					app.notifications.public.set(data.response);
					callback();
				},
				active: false
			}
		},
		model: model
	});
};