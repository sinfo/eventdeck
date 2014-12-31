/*global app*/
var AmpCollection = require('./notifications');
var AmpIOMixin = require('ampersand-collection-io-mixin');
var notification = require('./notification');
var log = require('bows')('io-notifications');

module.exports = function(socket){
	var IOMixin = AmpIOMixin.extend(socket);

	var events = {
	  fetch: 'notifications-public-get',
	  onFetch: 'notifications-public-get-response',
	  onNew: 'notify-public',
	};

	var listeners = {
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
			active: true
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
			active: true
		}
	};

	return (new AmpCollection(socket)).extend(new IOMixin(null, {events: events, listeners: listeners}));
};
