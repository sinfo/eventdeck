/*global app*/
// This app view is responsible for rendering all content that goes into
// <html>. It's initted right away and renders itself on DOM ready.

// This view also handles all the 'document' level events such as keyboard shortcuts.
var log = require('bows')('base');
var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
var _ = require('underscore');
var domify = require('domify');
var dom = require('ampersand-dom');
var templates = require('../templates');
var setFavicon = require('favicon-setter');
var BaseForm = require('client/js/forms/base');
var $ = require('jquery');

var searchTypeTimeout = null;

module.exports = View.extend({
  template: templates.body,
  initialize: function () {
    // this marks the correct nav item selected
    this.listenTo(app.router, 'page', this.handleNewPage);
  },
  events: {
    'click #logout': 'logout',
    'click a[href]': 'handleLinkClick',
    'change [data-hook~=base-form] select': 'handleEventChange',
    'input [data-hook~=base-form] input': 'handleSearchInput',
    'keydown [data-hook~=base-form] input': 'handleSearchKeydown',
  },
  subviews: {
    form: {
      // this is the css selector that will be the `el` in the
      // prepareView function.
      container: '.base-form',
      // this says we'll wait for `this.model` to be truthy
      prepareView: function (el) {
        return new BaseForm({
          el: el,
        });
      }
    }
  },
  render: function () {
    // some additional stuff we want to add to the document head
    document.head.appendChild(domify(templates.head()));

    // main renderer
    this.renderWithTemplate();

    // init and configure our page switcher
    this.pageSwitcher = new ViewSwitcher(this.queryByHook('page-container'), {
      show: function (newView, oldView) {
        // it's inserted and rendered for me
        document.title = _.result(newView, 'pageTitle') || 'EventDeck';
        document.scrollTop = 0;

        // add a class specifying it's active
        dom.addClass(newView.el, 'active');

        // store an additional reference, just because
        app.currentPage = newView;
      }
    });

    // setting a favicon for fun (note, it's dynamic)
    setFavicon('/static/favicon.ico');
    return this;
  },

  handleNewPage: function (view) {
    // tell the view switcher to render the new one
    this.pageSwitcher.set(view);

    // mark the correct nav item selected
    this.updateActiveNav();
  },

  handleLinkClick: function (e) {
    var aTag = e.target;
    var local = aTag.host === window.location.host;

    // if it's a plain click (no modifier keys)
    // and it's a local url, navigate internally
    if (local && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey && aTag.target != '_blank') {
      e.preventDefault();
      app.navigate(aTag.pathname);
    }
  },

  handleEventChange: function (e){
    app.me.selectedEvent = e.target.value;

    log('New event selected', app.me.selectedEvent, '(index: '+app.me.selectedEventIndex+')');

    app.companies.reset();
    app.companies.fetch();
  },

  handleSearchKeydown: function (e){
    var searchResults = $(this.queryByHook('search-results'));
    // down arrow or enter
    if (e.keyCode == 40 || e.keyCode == 13) {
      searchResults.find('a').first().focus();
      return false;
    }
    // up arrow
    else if (e.keyCode == 38) {
      searchResults.find('a').last().focus();
      return false;
    }
  },

  initializeSearch: function() {
    var self = this;
    var searchResults = $(this.queryByHook('search-results'));
    searchResults.mouseleave(function () {
      searchResults.hide();
    });

    searchResults.on('focus', 'a', function() {
      var $this = $(this);
      $this.parent().addClass('active').siblings().removeClass('active');
    }).on('keydown', 'a', function(e) {
      var $this = $(this);
      // backspace or escape
      if (e.keyCode == 8 || e.keyCode == 27) {
        e.preventDefault();
        $('.event input').focus();
      }
      // enter
      else if (e.keyCode == 13) {
        e.preventDefault();
        self.handleLinkClick(e);
        searchResults.hide();
      }
      // down arrow
      else if (e.keyCode == 40) {
        var next = $this.parent().next();
        if(next.hasClass('header')) {
          next = next.next();
        }

        next.find('a').focus();
        return false;
      }
      // up arrow
      else if (e.keyCode == 38) {
        var prev = $this.parent().prev();
        if(prev.hasClass('header')) {
          prev = prev.prev();
        }

        prev.find('a').focus();
        return false;
      }
    });

    this.searchReady = true;
  },

  handleSearchInput: function (e){
    if(!this.searchReady) {
      this.initializeSearch();
    }

    var self = this;
    var str = e.target.value;

    // only search when the user stops typing for 200 ms
    if(searchTypeTimeout !== null) {
      clearTimeout(searchTypeTimeout);
    }
    searchTypeTimeout = setTimeout(search, 200);

    function searchResultTemplate (name, url, img) {
      return '<li><a href="'+url+'" class="link"><img src="'+img+'" class="img"/><span class="name">'+name+'</span></a></li>';
    }

    function search () {
      var searchResults = $(self.queryByHook('search-results'));

      searchResults.show();

      if(str.length < 2) {
        searchResults.html('');
        return;
      }

      log('Searching for', str);

      $.get('/api/search/'+str, function (data) {
        searchResults.html('');
        log('Got', data);

        var resultsType = 'exact';
        if(!data.companies.exact.length && !data.speakers.exact.length && !data.members.exact.length) {
          resultsType = 'extended';
          searchResults.append('<li class="header">Showing Extended Results</li>');
        }

        var i, result;

        searchResults.append('<li class="header">'+data.companies[resultsType].length+' Companies</li>');
        for(i=0; i<data.companies[resultsType].length; i++) {
          result = {
            name: data.companies[resultsType][i].name,
            img: data.companies[resultsType][i].img,
            url: '/companies/'+data.companies[resultsType][i].id
          };

          searchResults.append(searchResultTemplate(result.name, result.url, result.img));
        }

        searchResults.append('<li class="header">'+data.speakers[resultsType].length+' Speakers</li>');
        for(i=0; i<data.speakers[resultsType].length; i++) {
          result = {
            name: data.speakers[resultsType][i].name,
            img: data.speakers[resultsType][i].img,
            url: '/speakers/'+data.speakers[resultsType][i].id
          };

          searchResults.append(searchResultTemplate(result.name, result.url, result.img));
        }

        searchResults.append('<li class="header">'+data.members[resultsType].length+' Members</li>');
        for(i=0; i<data.members[resultsType].length; i++) {
          result = {
            name: data.members[resultsType][i].name,
            img: data.members[resultsType][i].img,
            url: '/members/'+data.members[resultsType][i].id
          };

          searchResults.append(searchResultTemplate(result.name, result.url, result.img));
        }
      });
    }
  },

  updateActiveNav: function () {
    var path = window.location.pathname.slice(1);

    this.queryAll('nav a[href]').forEach(function (aTag) {
      var aPath = aTag.pathname.slice(1);

      if ((!aPath && !path) || (aPath && path.indexOf(aPath) === 0)) {
        dom.addClass(aTag.parentNode, 'active');
      } else {
        dom.removeClass(aTag.parentNode, 'active');
      }
    });
  },

  logout: function () {
    app.logout();
  }
});
