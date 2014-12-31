/*global app*/
var AmpCollection = require('ampersand-collection');
var notification = require('./notification');
var log = require('bows')('io-notifications');

module.exports = function(socket){
	return AmpCollection.extend({
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
	  model: notification(socket),
	});
};
