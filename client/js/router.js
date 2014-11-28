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
