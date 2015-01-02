/*global app*/
var log = require('bows')('io-notifications');
var _ =require('underscore');

var pageOptions = {
  data: {
    sort: '-posted'
  }
};


module.exports ={
	limit: 10,
	skip: 0,
	fetchPage: function(options){
    options || (options = {remove: false, merge: false, add: true});
    if(options.reset){
      options = {};
      this.skip = 0;
    }
    _.extend(this, options.data);
    pageOptions.data.limit = this.limit;
    pageOptions.data.skip = this.skip;
		_.extend(options, pageOptions);
    this.fetch(options);
		this.skip += this.limit;
	}
};
