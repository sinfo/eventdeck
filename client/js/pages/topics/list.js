/*global app, alert*/
var log = require('bows')('topics');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var TopicView = require('client/js/views/topic');
var Topic = require('client/js/models/topic');
var AmpersandCollection = require('ampersand-collection');
var topicKinds = require('options').kinds.topics;
var _ = require('client/js/helpers/underscore');
var $ = require('client/js/helpers/jquery');


var selectedFilter = 'showall';

function filtering(collection,filter){
  return collection.filter(function(topic){
    return topic.kind == filter;
  });
}
function rerender(page, collection, filter){
  page.renderWithTemplate();
  page.renderCollection(collection, TopicView, page.queryByHook('topics-list'));

  page.renderKindFilters();

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

    'click [data-hook~=kind-filters]': 'handleKindFilter',

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

    this.renderKindFilters();

    this.queryByHook(selectedFilter).classList.add('selected');
  },
  fetchCollection: function () {
    log('Fetching topics');
    this.collection.fetch();

    return false;
  },
  renderKindFilters: function () {
    var self = this;
    var filterContainer = $(self.queryByHook('kind-filters'));// $.hook('kind-filters');
    _.each(topicKinds, function (kind) {
      filterContainer.append('<li><div class=\'ink-button\' data-hook=\''+kind.id+'\'>'+kind.name+'</div></li>');
    });
  },
  handleKindFilter: function (ev) {
    var kind = ev.target.getAttribute('data-hook');

    log('Fetching', kind);

    var aux = filtering(this.collection, kind);
    aux = new AmpersandCollection(aux, {model: Topic});

    rerender(this,aux,kind);

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
