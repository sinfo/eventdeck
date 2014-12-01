/*global app, alert*/
var log = require('bows')('speakers');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var SpeakerView = require('client/js/views/speaker');
var Speaker = require('client/js/models/speaker');
var AmpersandCollection = require('ampersand-collection');


var selectedFilter = 'showall';

function filtering(collection,filter){
    return collection.filter(function(speaker){
      return speaker.participation && speaker.participation.status == filter;
    });
}
function rerender(page, collection, filter){

    console.log(page.queryByHook(selectedFilter));
    page.renderWithTemplate();
    page.renderCollection(collection, SpeakerView, page.queryByHook('speakers-list'));

    page.queryByHook(selectedFilter).classList.remove('selected');
    page.queryByHook(filter).classList.add('selected');
    selectedFilter = filter;

    return false;
}

module.exports = PageView.extend({
  pageTitle: 'Speakers',
  template: templates.pages.speakers.list,
  events: {
    'click [data-hook~=shuffle]': 'shuffle',
    'click [data-hook~=fetch]': 'fetchCollection',
    'click [data-hook~=reset]': 'resetCollection',

    'click [data-hook~=selected]': 'selected',
    'click [data-hook~=approved]': 'approved',
    'click [data-hook~=contacted]': 'contacted',
    'click [data-hook~=inconversations]': 'inconversations',
    'click [data-hook~=accepted]': 'accepted',
    'click [data-hook~=rejected]': 'rejected',
    'click [data-hook~=giveup]': 'giveup',

    'click [data-hook~=showall]': 'showall',
    'click [data-hook~=me]': 'me',
    'click [data-hook~=noMember]': 'noMember',
    'click [data-hook~=noParticipation]': 'noParticipation',

    'click [data-hook~=hide]': 'hide',
  },
  hidden: false,
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, SpeakerView, this.queryByHook('speakers-list'));
    if (!this.collection.length) {
      this.fetchCollection();
    }

    this.queryByHook(selectedFilter).classList.add('selected');
  },
  fetchCollection: function () {
    log('Fetching speakers');
    this.collection.fetch();

    return false;
  },
  resetCollection: function (){
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
    log('Fetching contacted Speakers');
    var aux =  filtering(this.collection,'Contacted');

    aux = new AmpersandCollection(aux, {model: Speaker});

    rerender(this,aux,'contacted');

    return false;
  },
  selected: function () {
    log('Fetching Selected Speakers');
    var aux = filtering(this.collection,'Selected');

    aux = new AmpersandCollection(aux, {model: Speaker});

    rerender(this,aux,'selected');

    return false;
  },
  approved: function () {
    log('Fetching Approved Speakers');
    var aux = filtering(this.collection,'Approved');

    aux = new AmpersandCollection(aux, {model: Speaker});

    rerender(this,aux,'approved');

    return false;
  },
  rejected: function () {
    log('Fetching Rejected Speakers');
    var aux = filtering(this.collection,'Rejected');

    aux = new AmpersandCollection(aux, {model: Speaker});

    rerender(this,aux,'rejected');

    return false;
  },
  giveup: function () {
    log('Fetching Gave up Speakers');
    var aux = filtering(this.collection,'Give Up');

    aux = new AmpersandCollection(aux, {model: Speaker});

    rerender(this,aux,'giveup');

    return false;
  },
  inconversations: function () {
    log('Fetching Selected Speakers');
    var aux = filtering(this.collection,'In Conversations');

    aux = new AmpersandCollection(aux, {model: Speaker});

    rerender(this,aux,'inconversations');

    return false;
  },
  accepted: function () {
    log('Fetching Accepted Speakers');
    var aux = filtering(this.collection,'Accepted');

    aux = new AmpersandCollection(aux, {model: Speaker});

    rerender(this,aux,'accepted');

    return false;
  },
  me: function () {
    log('Fetching Selected Speakers');
    var aux = this.collection.filter(function(speaker){
      return speaker.participation && speaker.participation.member == app.me.id;
    });

    aux = new AmpersandCollection(aux, {model: Speaker});

    rerender(this,aux,'me');

    return false;
  },
  noMember: function () {
    log('Fetching Selected Speakers');
    var aux = this.collection.filter(function(speaker){
      return speaker.participation && !speaker.participation.member;
    });

    aux = new AmpersandCollection(aux, {model: Speaker});

    rerender(this,aux,'noMember');

    return false;
  },
  noParticipation: function () {
    log('Fetching Selected Speakers');
    var aux = this.collection.filter(function(speaker){
      return !speaker.participation;
    });

    aux = new AmpersandCollection(aux, {model: Speaker});

    rerender(this,aux,'noParticipation');
    return false;
  },
  showall: function () {
    rerender(this,this.collection,'showall');
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
