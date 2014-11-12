var log = require('bows')('companies');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CompanyView = require('client/js/views/company');
var Company = require('client/js/models/company');
var AmpersandCollection = require('ampersand-collection');


module.exports = PageView.extend({
  pageTitle: 'Companies',
  template: templates.pages.companies.list,
  events: {
    'click [data-hook~=shuffle]': 'shuffle',
    'click [data-hook~=fetch]': 'fetchCollection',
    'click [data-hook~=reset]': 'resetCollection',

    'click [data-hook~=selected]': 'selected',
    'click [data-hook~=contacted]': 'contacted',
    'click [data-hook~=inconversations]': 'inconversations',
    'click [data-hook~=closeddeal]': 'closeddeal',
    'click [data-hook~=rejected]': 'rejected',
    'click [data-hook~=giveup]': 'giveup',

  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, CompanyView, this.queryByHook('companies-list'));
    if (!this.collection.length) {
      this.fetchCollection();
    }
  },
  fetchCollection: function () {
    log('Fetching companies');
    this.collection.fetch();

    this.renderWithTemplate();
    this.renderCollection(this.collection, CompanyView, this.queryByHook('companies-list'));

    return false;
  },
  resetCollection: function () {
    this.collection.reset();
  },
  shuffle: function () {
    this.collection.comparator = function () {
      return !Math.round(Math.random());
    };
    this.collection.sort();
    delete this.collection.comparator;
    return false;
  },
  selected: function () {
    log('Fetching  Selected Companies')
    var aux = this.collection.filter(function(company){
      return company.participation && company.participation.status == 'Selected';
    });

    aux = new AmpersandCollection(aux, {model: Company});
    this.renderWithTemplate();
    this.renderCollection(aux, CompanyView, this.queryByHook('companies-list'));
    return false;
  },  
  inconversations: function () {
    log('Fetching  Selected Companies')
    var aux = this.collection.filter(function(company){
      return company.participation && company.participation.status == 'In Conversations';
    });

    aux = new AmpersandCollection(aux, {model: Company});
    this.renderWithTemplate();
    this.renderCollection(aux, CompanyView, this.queryByHook('companies-list'));
    return false;
  },
});
