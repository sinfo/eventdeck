/*global app, alert*/
var log = require('bows')('sessions');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var SessionView = require('client/js/views/session');
var Session = require('client/js/models/session');
var AmpersandCollection = require('ampersand-collection');
var Calendar = require('ampersand-fullcalendar-view');


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
    if (!this.collection.length) {
      this.fetchCollection();
    }
  },
  fetchCollection: function () {
    var self = this;
    log('Fetching sessions');
    this.collection.fetch({success: function () {
      self.render();
    }});

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
  },
  subviews: {
    calendar: {
      container: '[data-hook=sessions-list]',
      waitFor: 'collection.length',
      prepareView: function (el) {
        log('Rendering calendar!');
        return new Calendar({
          el: el,
          collection: this.collection,
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
          },
        });
      }
    },
  }
});
