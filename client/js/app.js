/*global app*/
var _ = require('underscore');
var log = require('bows')('eventdeck');
var config = require('clientconfig');
var $ = require('jquery');
var Ink = require('./ink-all');
var io = require('socket.io-client');

var Router = require('./router');
var MainView = require('./views/main');
var domReady = require('domready');

var Me = require('./models/me');
var Events = require('./models/events');
var Members = require('./models/members');
var Companies = require('./models/companies');
var Speakers = require('./models/speakers');
var Tags = require('./models/tags');
var Topics = require('./models/topics');
var Communications = require('./models/communications');
var Notifications = require('./models/notifications');


module.exports = {
  // this is the the whole app initter
  blastoff: function () {
    var self = window.app = this;

    log('Blasting off!');

    this.me = new Me();
    this.socket = io.connect();
    this.socketInit();
    this.events = new Events();
    this.members = new Members();
    this.companies = new Companies();
    this.speakers = new Speakers();
    this.tags = new Tags();
    this.topics = new Topics();
    // this.notifications = new Notifications();
    this.fetchInitialData();

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

  fetchInitialData: function () {
    var self = this;

    self.me.fetch({
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

    self.events.fetch({
      success: function(collection, response, options) {
        app.me.selectedEvent = collection.toJSON()[0].id;
        log('Got '+collection.length+' events, '+app.me.selectedEvent+' is the default one. ', collection.toJSON());
      }
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
      this.router.history.navigate('/login', {trigger: true});
    }
  },

  login: function (id, code) {
    $.get('/api/auth/login/' + id + '/' + code, function () {
      app.fetchInitialData();
      app.me.authenticated = true;
      app.navigate('/');
    });
  },

  logout: function () {
    $.get('/api/auth/logout', function () {
      app.me.authenticated = false;
      app.navigate('/login');
    });
  },

  socketInit: function () {
    var self = this;
    this.socket.on('connect', function(){
      log('Connected!');
      self.me.online = true;
      self.me.error = false;
    });
    this.socket.on('disconnect', function(){
      log('Disconnected!');
      self.me.online = false;
    });
    this.socket.on('reconnecting', function(attempts){
      log('Reconnecting');
      self.me.reconnecting = true;
    });
    this.socket.on('reconnect', function(attempts){
      log('Reconnected');
      self.me.reconnecting = false;
    });
    this.socket.on('reconnect_failed', function(){
      log('Reconnect failed');
      self.me.reconnecting = false;
    });
    this.socket.on('reconnect_error', function(error){
      log('Reconnection error', error);
      self.me.error = true;
    });
    this.socket.on('error', function(error){
      log('Connection error', error);
      self.me.error = true;
    });
  }
};

// run it
module.exports.blastoff();
