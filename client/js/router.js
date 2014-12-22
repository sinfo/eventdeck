/*global me, app*/
var Router = require('ampersand-router');

var HomePage = require('./pages/home');

var LoginPage = require('./pages/login');
var LoginCodePage = require('./pages/loginCode');

var Members = require('./pages/members/list');
var MemberAddPage = require('./pages/members/add');
var MemberEditPage = require('./pages/members/edit');
var MemberViewPage = require('./pages/members/view');

var Companies = require('./pages/companies/list');
var CompanyAddPage = require('./pages/companies/add');
var CompanyEditPage = require('./pages/companies/edit');
var CompanyViewPage = require('./pages/companies/view');
var CompanyMemberTable = require('./pages/companies/table');

var Sessions = require('./pages/sessions/list');
var SessionAddPage = require('./pages/sessions/add');
var SessionEditPage = require('./pages/sessions/edit');
var SessionViewPage = require('./pages/sessions/view');

var Speakers = require('./pages/speakers/list');
var SpeakerAddPage = require('./pages/speakers/add');
var SpeakerEditPage = require('./pages/speakers/edit');
var SpeakerViewPage = require('./pages/speakers/view');
var SpeakerMemberTable = require('./pages/speakers/table');

var Topics = require('./pages/topics/list');
var TopicAddPage = require('./pages/topics/add');
var TopicEditPage = require('./pages/topics/edit');
var TopicViewPage = require('./pages/topics/view');


module.exports = Router.extend({
  routes: {
    '': 'home',
    'login': 'login',
    'login/:id/:code': 'loginCode',
    'members': 'members',
    'members/add': 'memberAdd',
    'members/:id': 'memberView',
    'members/:id/edit': 'memberEdit',
    'companies': 'companies',
    'companies/table': 'companiesTable',
    'companies/add': 'companyAdd',
    'companies/:id': 'companyView',
    'companies/:id/edit': 'companyEdit',
    'topics': 'topics',
    'topics/add': 'topicAdd',
    'topics/:id': 'topicView',
    'topics/:id/edit': 'topicEdit',
    'sessions/': 'sessions',
    'sessions/add': 'sessionAdd',
    'sessions/:id': 'sessionView',
    'sessions/:id/edit': 'sessionEdit',
    'speakers': 'speakers',
    'speakers/table': 'speakersTable',
    'speakers/add': 'speakerAdd',
    'speakers/:id': 'speakerView',
    'speakers/:id/edit': 'speakerEdit',
    '(*path)': 'catchAll',
  },

  // ------- ROUTE HANDLERS ---------
  home: function () {
    this.trigger('page', new HomePage());
  },

  login: function () {
    this.trigger('page', new LoginPage());
  },

  loginCode: function (id, code) {
    this.trigger('page', new LoginCodePage({
      id: id,
      code: code
    }));
  },


  members: function () {
    this.trigger('page', new Members({
      collection: app.members
    }));
  },

  memberAdd: function () {
    this.trigger('page', new MemberAddPage());
  },

  memberEdit: function (id) {
    this.trigger('page', new MemberEditPage({
      id: id
    }));
  },

  memberView: function (id) {
    this.trigger('page', new MemberViewPage({
      id: id
    }));
  },


  companies: function () {
    this.trigger('page', new Companies({
      collection: app.companies
    }));
  },

  companyAdd: function () {
    this.trigger('page', new CompanyAddPage());
  },

  companyEdit: function (id) {
    this.trigger('page', new CompanyEditPage({
      id: id
    }));
  },

  companyView: function (id) {
    this.trigger('page', new CompanyViewPage({
      id: id
    }));
  },

  companiesTable: function () {
    this.trigger('page', new CompanyMemberTable({
      collection: app.members
    }));
  },


  sessions: function () {
    this.trigger('page', new Sessions({
      collection: app.sessions
    }));
  },

  sessionAdd: function () {
    this.trigger('page', new SessionAddPage());
  },

  sessionEdit: function (id) {
    this.trigger('page', new SessionEditPage({
      id: id
    }));
  },

  sessionView: function (id) {
    this.trigger('page', new SessionViewPage({
      id: id
    }));
  },


  speakers: function () {
    this.trigger('page', new Speakers({
      collection: app.speakers
    }));
  },

  speakerAdd: function () {
    this.trigger('page', new SpeakerAddPage());
  },

  speakerEdit: function (id) {
    this.trigger('page', new SpeakerEditPage({
      id: id
    }));
  },

  speakerView: function (id) {
    this.trigger('page', new SpeakerViewPage({
      id: id
    }));
  },

  speakersTable: function () {
    this.trigger('page', new SpeakerMemberTable({
      collection: app.members
    }));
  },

  topics: function () {
    this.trigger('page', new Topics({
      collection: app.topics
    }));
  },

  topicAdd: function () {
    this.trigger('page', new TopicAddPage());
  },

  topicEdit: function (id) {
    this.trigger('page', new TopicEditPage({
      id: id
    }));
  },

  topicView: function (id) {
    this.trigger('page', new TopicViewPage({
      id: id
    }));
  },

  catchAll: function () {
    this.redirectTo('');
  }
});
