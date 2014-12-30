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
				app.notifications.add(data);
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

	return AmpCollection.extend(new IOMixin(null, {events: events, listeners: listeners}), {
		limit: 10,
		page: 10,
		skip: 0,
		fetchPage: function(){
			this.fetch({
				data: {
					limit: this.limit,
					skip: this.skip
				}
			});
			this.limit += this.page;
			this.skip += this.page;
		},
		init: function(){
			var callback = function(err){
        if(err){
          log(err);
        }
      };

      var sendOptions = {
        callback: function(err){
          callback(err);
          app.notifications.emit('count', {id: app.me.id}, {callback: callback});
          app.notifications.fetch({callback: callback});
        }
      };

      app.notifications.emit('init', {user: app.me}, sendOptions);
		},
	  model: notification(socket),
	});
};
