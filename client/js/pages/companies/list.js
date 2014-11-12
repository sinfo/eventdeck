var log = require('bows')('companies');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CompanyView = require('client/js/views/company');
var Company = require('client/js/models/company');
var AmpersandCollection = require('ampersand-collection');



function filtering(collection,filter){
    return collection.filter(function(company){
      return company.participation && company.participation.status == filter;
    });
  }
function rerender(page,collection){
    page.renderWithTemplate();
    page.renderCollection(collection, CompanyView, page.queryByHook('companies-list'));
    return false;
  }

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
    'click [data-hook~=innegotiations]': 'innegotiations',
    'click [data-hook~=showall]': 'showall',
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
  contacted: function () {
    log('Fetching  contacted Companies')
    var aux =  filtering(this.collection,'Contacted');

    aux = new AmpersandCollection(aux, {model: Company});
    rerender(this,aux);
    return false;
  },  
  selected: function () {
    log('Fetching  Selected Companies')
    var aux = filtering(this.collection,'Selected');

    aux = new AmpersandCollection(aux, {model: Company});
    rerender(this,aux);
    return false;
  },
  closeddeal: function () {
    log('Fetching  Closed Deal Companies')
    var aux = filtering(this.collection,'Closed Deal');

    aux = new AmpersandCollection(aux, {model: Company});
    rerender(this,aux);
    return false;
  },
  rejected: function () {
    log('Fetching  Rejected Companies')
    var aux = filtering(this.collection,'Rejected');

    aux = new AmpersandCollection(aux, {model: Company});
    rerender(this,aux);
    return false;
  },
  giveup: function () {
    log('Fetching  Gave up Companies')
    var aux = filtering(this.collection,'Give Up');

    aux = new AmpersandCollection(aux, {model: Company});
    rerender(this,aux);
    return false;
  },    
  inconversations: function () {
    log('Fetching  Selected Companies')
    var aux = filtering(this.collection,'In Conversations');

    aux = new AmpersandCollection(aux, {model: Company});
    rerender(this,aux);
    return false;
  },
  innegotiations: function () {
    log('Fetching  Selected Companies')
    var aux = filtering(this.collection,'In Negotiations');

    aux = new AmpersandCollection(aux, {model: Company});
    rerender(this,aux);
    return false;
  },
  showall: function () {
    rerender(this,this.collection);
    return false;
  },
});
