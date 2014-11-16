/*global app, me, $*/
var _ = require('underscore');
var log = require('bows')('eventdeck');
var config = require('clientconfig');
var $ = require('jquery');

var Router = require('./router');
var MainView = require('./views/main');
var domReady = require('domready');

var Me = require('./models/me');
var Events = require('./models/events');
var Members = require('./models/members');
var Companies = require('./models/companies');
var Communications = require('./models/communications');


module.exports = {
  // this is the the whole app initter
  blastoff: function () {
    var self = window.app = this;

    log('Blasting off!');

    this.me = new Me();

    this.me.fetch({
      success: function(model, response, options) {
        log('Hello ' + model.name + '!');
        model.authenticated = true;
      },
      error: function(model, response, options) {
        log('Please log in first!');
        model.authenticated = false;

        self.router.history.navigate('/login', {trigger: true});
      }
    });

    this.events = new Events();
    this.events.fetch({
      success: function(collection, response, options) {
        app.me.selectedEvent = collection.toJSON()[0].id;
        log('Got '+collection.length+' events, '+app.me.selectedEvent+' is the default one. ', collection.toJSON());
      }
    });

    this.members = new Members();
    this.companies = new Companies();

    // init our URL handlers and the history tracker
    this.router = new Router();

    // wait for document ready to render our main view
    // this ensures the document has a body, etc.
    domReady(function () {
      // init our main view
      var mainView = self.view = new MainView({
        el: document.body,
        collection: this.events
      });

      // ...and render it
      mainView.render();

      // we have what we need, we can now start our router and show the appropriate page
      self.router.history.start({pushState: true, root: '/'});
    });
  },

  // This is how you navigate around the app.
  // this gets called by a global click handler that handles
  // all the <a> tags in the app.
  // it expects a url without a leading slash.
  // for example: "costello/settings".
  navigate: function (page) {
    if (app.me.authenticated) {
      var url = (page.charAt(0) === '/') ? page.slice(1) : page;
      this.router.history.navigate(url, {trigger: true});
    }
    else {
      self.router.history.navigate('/login', {trigger: true});
    }
  },

  login: function (id, code) {
    $.get('/api/auth/login/' + id + '/' + code, function () {
      app.me.authenticated = true;
      app.navigate('/');
    });
  },

  logout: function () {
    $.get('/api/auth/logout', function () {
      app.me.authenticated = false;
      app.navigate('/login');
    });
  }
};

// run it
module.exports.blastoff();
