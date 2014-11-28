/*global app, alert*/
var log = require('bows')('topics');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var TopicView = require('client/js/views/topic');
var Topic = require('client/js/models/topic');
var AmpersandCollection = require('ampersand-collection');


var selectedFilter = 'showall';

function filtering(collection,filter){
  return collection.filter(function(topic){
    return topic.kind == filter;
  });
}
function rerender(page, collection, filter){
  page.renderWithTemplate();
  page.renderCollection(collection, TopicView, page.queryByHook('topics-list'));

  page.queryByHook(selectedFilter).classList.remove('selected');
  page.queryByHook(filter).classList.add('selected');
  selectedFilter = filter;

  return false;
}

module.exports = PageView.extend({
  pageTitle: 'Topics',
  template: templates.pages.topics.list,
  events: {
    'click [data-hook~=showall]': 'showall',

    'click [data-hook~=idea]': 'idea',
    'click [data-hook~=info]': 'info',
    'click [data-hook~=todo]': 'todo',
    'click [data-hook~=decision]': 'decision',
    'click [data-hook~=meeting]': 'meeting',

    'click [data-hook~=me]': 'me',

    'click [data-hook~=hide]': 'hide',
  },
  hidden: false,
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, TopicView, this.queryByHook('topics-list'));
    if (!this.collection.length) {
      this.fetchCollection();
    }

    this.queryByHook(selectedFilter).classList.add('selected');
  },
  fetchCollection: function () {
    log('Fetching topics');
    this.collection.fetch();

    return false;
  },
  idea: function () {
    log('Fetching ideas');
    var aux =  filtering(this.collection, 'idea');

    aux = new AmpersandCollection(aux, {model: Topic});

    rerender(this,aux,'idea');

    return false;
  },
  info: function () {
    log('Fetching infos');
    var aux = filtering(this.collection,'info');

    aux = new AmpersandCollection(aux, {model: Topic});

    rerender(this,aux,'info');

    return false;
  },
  todo: function () {
    log('Fetching todos');
    var aux = filtering(this.collection,'todo');

    aux = new AmpersandCollection(aux, {model: Topic});

    rerender(this,aux,'todo');

    return false;
  },
  decision: function () {
    log('Fetching decisions');
    var aux = filtering(this.collection,'decision');

    aux = new AmpersandCollection(aux, {model: Topic});

    rerender(this,aux,'decision');

    return false;
  },
  meeting: function () {
    log('Fetching meetings');
    var aux = filtering(this.collection,'meeting');

    aux = new AmpersandCollection(aux, {model: Topic});

    rerender(this,aux,'meeting');

    return false;
  },
  me: function () {
    log('Fetching my topics');
    var aux = this.collection.filter(function(topic){
      return topic.targets && topic.targetsindexOf(app.me.id) != -1;
    });

    aux = new AmpersandCollection(aux, {model: Topic});

    rerender(this,aux,'me');

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
