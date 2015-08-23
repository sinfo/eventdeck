/*global app*/
var _ = require('underscore');
var async = require('async');
var log = require('bows')('eventdeck');
var config = require('client/js/helpers/clientconfig');
var $ = require('jquery');
var Ink = require('./ink-all');

var Router = require('./router');
var MainView = require('./views/main');
var domReady = require('domready');
var IO = require('./sockets');

var Me = require('./models/me');
var Events = require('./models/events');
var Members = require('./models/members');
var Companies = require('./models/companies');
var Sessions = require('./models/sessions');
var Speakers = require('./models/speakers');
var Tags = require('./models/tags');
var Topics = require('./models/topics');
var Communications = require('./models/communications');
var PublicNotifications = require('./models/publicNotifications');
var PrivateNotifications = require('./models/privateNotifications');

module.exports = {
  // this is the the whole app initter
  blastoff: function () {
    var self = window.app = this;

    log('Blasting off!');

    this.config = config;
    this.me = new Me();
    this.events = new Events();
    this.members = new Members();
    this.companies = new Companies();
    this.sessions = new Sessions();
    this.speakers = new Speakers();
    this.tags = new Tags();
    this.topics = new Topics();

    this.socket = new IO(null, {initListeners: true});
    this.notifications = {};
    PublicNotifications = new PublicNotifications(this.socket);
    PrivateNotifications = new PrivateNotifications(this.socket);
    this.notifications.public = new PublicNotifications(null, {initListeners: true});
    this.notifications.private = new PrivateNotifications(null, {initListeners: true});

    //assign error callbacks
    this.notifications.public.on('error', this.notifications.public.error);
    this.notifications.private.on('error', this.notifications.public.error);

    // init our URL handlers and the history tracker
    self.router = new Router();

    this.fetchInitialData(function(){

      // wait for document ready to render our main view
      // this ensures the document has a body, etc.
      domReady(function () {

        // init our main view
        var mainView = self.view = new MainView({
          el: document.body,
          model: self.me,
          collection: self.notifications.private
        });

        // ...and render it
        mainView.render();

        // we have what we need, we can now start our router and show the appropriate page
        self.router.history.start({pushState: true, root: '/'});

        //401 navigate to login
        if(!self.me.authenticated){
          return self.router.history.navigate('/login', {trigger: true});
        }
      });
    });
  },

  fetchInitialData: function (cb) {
    var self = this;

    async.parallel([
      function fetchMe (cbAsync){
        self.me.fetch({
          success: function(model, response, options) {
            log('Hello ' + model.name + '!');
            model.authenticated = true;

            self.socket.init();
            cbAsync();
          },
          error: function(model, response, options) {
            log('Please log in first!');
            model.authenticated = false;
            cbAsync();
          }
        });
      },
      function fetchEvents (cbAsync){
        self.events.fetch({
          success: function(collection, response, options) {
            app.me.selectedEvent = collection.toJSON()[0].id;
            log('Got '+collection.length+' events, '+app.me.selectedEvent+' is the default one. ', collection.toJSON());
            cbAsync();
          },
          error: function(collection, response, options) {
            log('Error fetching events', response);
            cbAsync();
          }
        });
      },
      function fetchTags (cbAsync){
        app.tags.fetch({
          success: function(collection, response, options) {
            cbAsync();
          },
          error: function(collection, response, options) {
            log('Error fetching tags', response);
            cbAsync();
          }
        });
      }
    ], cb);

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
      app.fetchInitialData(function(){
        app.navigate('/');
      });
    });
  },

  loginWithFacebook: function (id, token) {
    $.get('/api/auth/facebook/' + id + '/' + token, function () {
      app.fetchInitialData(function(){
        app.navigate('/');
      });
    });
  },

  logout: function () {
    $.get('/api/auth/logout', function () {
      app.me.authenticated = false;
      app.navigate('/login');
    });
  },

  access: function (model) {
    var access ={
      member: app.me.id,
      thread: model.thread
    };
    model.unread = false;
    app.notifications.private.emit('access', access, function(err, result){
      if(err){
        log(err);
        return;
      }
      app.notifications.private.fetchPage({reset: true});
    });
  }
};

// run it
module.exports.blastoff();
