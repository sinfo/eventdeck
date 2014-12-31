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
    console.log(this);
    this.fetch(options);
		this.limit += this.page;
		this.skip += this.page;
	}
};
