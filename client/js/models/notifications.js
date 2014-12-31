/*global app*/
var AmpCollection = require('ampersand-collection');
var notification = require('./notification');
var log = require('bows')('io-notifications');
var _ =require('underscore');

var pageOptions = {
  data: {
    sort: '-posted'
  }
};

module.exports = function(socket){
  var model = notification(socket);

	return AmpCollection.extend({
		limit: 10,
		page: 10,
		skip: 0,
		fetchPage: function(options){
      options || (options = {});
      if(options.start){
        this.limit = 10;
        this.skip = 0;
      }
      _.extend(this, options.data);
      pageOptions.data.limit = this.limit;
      pageOptions.data.skip = this.skip;
			_.extend(options, pageOptions);
      this.fetch(options);
			this.limit += this.page;
			this.skip += this.page;
		},
    model: model,
 });
};
