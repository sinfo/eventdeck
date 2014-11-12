/*global app, me, $*/
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


module.exports = View.extend({
  template: templates.body,
  initialize: function () {
    // this marks the correct nav item selected
    this.listenTo(app.router, 'page', this.handleNewPage);
  },
  events: {
    'click a[href]': 'handleLinkClick',
    'change .base-form select': 'handleEventChange'
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
        document.title = _.result(newView, 'pageTitle') || "EventDeck";
        document.scrollTop = 0;

        // add a class specifying it's active
        dom.addClass(newView.el, 'active');

        // store an additional reference, just because
        app.currentPage = newView;
      }
    });

    // setting a favicon for fun (note, it's dynamic)
    setFavicon('/images/ampersand.png');
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
    if (local && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
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
  }
});
