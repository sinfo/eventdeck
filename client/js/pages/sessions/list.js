/*global app, alert*/
var log = require('bows')('sessions');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var SessionView = require('client/js/views/session');
var Session = require('client/js/models/session');
var AmpersandCollection = require('ampersand-collection');


var selectedFilter = 'showall';

module.exports = PageView.extend({
  pageTitle: 'Sessions',
  template: templates.pages.sessions.list,
  events: {
    'click [data-hook~=shuffle]': 'shuffle',
    'click [data-hook~=fetch]': 'fetchCollection',
    'click [data-hook~=reset]': 'resetCollection',

    'click [data-hook~=hide]': 'hide',
  },
  hidden: false,
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, SessionView, this.queryByHook('sessions-list'));
    if (!this.collection.length) {
      this.fetchCollection();
    }
  },
  fetchCollection: function () {
    log('Fetching sessions');
    this.collection.fetch();

    return false;
  },
  hide: function(){
    if(!this.hidden){
      this.queryByHook('awesome-sidebar').style.display = 'none';
      this.hidden = true;
    }
    else{
      this.queryByHook('awesome-sidebar').style.display = 'block';
      this.hidden = false;
    }
  }
});
