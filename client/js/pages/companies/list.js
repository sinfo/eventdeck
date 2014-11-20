var log = require('bows')('companies');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CompanyView = require('client/js/views/company');
var Company = require('client/js/models/company');
var AmpersandCollection = require('ampersand-collection');


var selectedFilter = 'showall';

function filtering(collection,filter){
    return collection.filter(function(company){
      return company.participation && company.participation.status == filter;
    });
  }
function rerender(page, collection, filter){

    console.log(page.queryByHook(selectedFilter));
    page.renderWithTemplate();
    page.renderCollection(collection, CompanyView, page.queryByHook('companies-list'));

    page.queryByHook(selectedFilter).classList.remove('selected');
    page.queryByHook(filter).classList.add('selected');
    selectedFilter = filter;

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

    'click [data-hook~=me]': 'me',
    'click [data-hook~=noMember]': 'noMember',
    'click [data-hook~=noParticipation]': 'noParticipation',

    'click [data-hook~=hide]': 'hide',
  },
  hidden: false,
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, CompanyView, this.queryByHook('companies-list'));
    if (!this.collection.length) {
      this.fetchCollection();
    }

    this.queryByHook(selectedFilter).classList.add('selected');
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
    log('Fetching contacted Companies');
    var aux =  filtering(this.collection,'Contacted');

    aux = new AmpersandCollection(aux, {model: Company});

    rerender(this,aux,'contacted');

    return false;
  },
  selected: function () {
    log('Fetching Selected Companies');
    var aux = filtering(this.collection,'Selected');

    aux = new AmpersandCollection(aux, {model: Company});

    rerender(this,aux,'selected');

    return false;
  },
  closeddeal: function () {
    log('Fetching Closed Deal Companies');
    var aux = filtering(this.collection,'Closed Deal');

    aux = new AmpersandCollection(aux, {model: Company});

    rerender(this,aux,'closeddeal');

    return false;
  },
  rejected: function () {
    log('Fetching Rejected Companies');
    var aux = filtering(this.collection,'Rejected');

    aux = new AmpersandCollection(aux, {model: Company});

    rerender(this,aux,'rejected');

    return false;
  },
  giveup: function () {
    log('Fetching Gave up Companies');
    var aux = filtering(this.collection,'Give Up');

    aux = new AmpersandCollection(aux, {model: Company});

    rerender(this,aux,'giveup');

    return false;
  },
  inconversations: function () {
    log('Fetching Selected Companies');
    var aux = filtering(this.collection,'In Conversations');

    aux = new AmpersandCollection(aux, {model: Company});

    rerender(this,aux,'inconversations');

    return false;
  },
  innegotiations: function () {
    log('Fetching Selected Companies');
    var aux = filtering(this.collection,'In Negotiations');

    rerender(this,aux,'innegotiations');

    return false;
  },
  me: function () {
    log('Fetching Selected Companies');
    var aux = this.collection.filter(function(company){
      return company.participation && company.participation.member == app.me.id;
    });

    rerender(this,aux,'me');

    return false;
  },
  noMember: function () {
    log('Fetching Selected Companies');
    var aux = this.collection.filter(function(company){
      return company.participation && !company.participation.member;
    });

    rerender(this,aux,'noMember');

    return false;
  },
  noParticipation: function () {
    log('Fetching Selected Companies');
    var aux = this.collection.filter(function(company){
      return !company.participation;
    });

    rerender(this,aux,'noParticipation');
    return false;
  },
  showall: function () {
    rerender(this,aux,'showall');
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
  }
});
