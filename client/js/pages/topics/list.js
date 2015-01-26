/*global app, alert*/
var log = require('bows')('topics');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var TopicView = require('client/js/views/topic');
var Topic = require('client/js/models/topic');
var AmpersandCollection = require('ampersand-collection');
var topicKinds = require('options').kinds.topics;
var Tag = require('client/js/models/tag');
var _ = require('client/js/helpers/underscore');
var $ = require('client/js/helpers/jquery');
var async = require('async');


var selectedKind = 'showall';
var selectedTag = 'showall';
var selectedClosed = 'open';
var tempCollection;

function filterClosed(collection,filter){
  return collection.filter(function(topic){
    return topic.closed == filter;
  });
}

function filterKind(collection,filter){
  if(filter != 'showall'){
    return collection.filter(function(topic){
      return topic.kind == filter;
    });
  }
  else{
    return collection;
  }
}

function filterTag(collection,filter){
  if(filter != 'showall'){
    return collection.filter(function(topic){
      return topic.tags.indexOf(filter) != -1;
    });
  }
  else{
    return collection;
  }
}

module.exports = PageView.extend({
  pageTitle: 'Topics',

  template: templates.pages.topics.list,

  events: {
    'click [data-hook~=showall]': 'showall',
    'click [data-hook~=kind-filters]': 'handleKindFilter',
    'click [data-hook~=tag-filters]': 'handleTagFilter',
    'click [data-hook~=closed-filters]' : 'handleClosed',
    'click [data-hook~=me]': 'me',
    'click [data-hook~=hide]': 'hide',
  },

  hidden: false,

  initialize: function () {
    var self = this;

    selectedTag = 'showall';
    selectedKind = 'showall';

    if (!this.collection.length) {
      this.fetchCollection();
    }
    if (!app.tags.length) {
      app.tags.fetch({success: function () {
        log('got tags', app.tags.serialize());
        self.render();
      }});
    }
  },
  render: function () {
    var self = this;
    this.renderWithTemplate();

    if (app.tags.length) {
      self.renderTagFilters();
    }

    self.renderCards(tempCollection);
    this.renderKindFilters();
    this.renderClosedFilters();

    this.queryByHook(selectedKind).classList.add('selected');
    this.queryByHook(selectedTag).classList.add('selected');

    tempCollection = this.collection;

    this.showall();
  },

  fetchCollection: function () {
    log('Fetching topics');
    var self = this;
    this.collection.fetch({
      success: function () {
        var aux = self.collection.filter(function(topic){
          return topic.closed === false;
        });
        tempCollection = new AmpersandCollection(aux, {model: Topic});

        self.render();
      }
    });

    return false;
  },

  renderCards: function (collection) {
    if(!collection || !collection.length) {
      return;
    }

    var groups = $(this.queryByHook('topics-list')).children('div');

    for (var i = 0; i < groups.length; i++) {
      var columns = $(groups[i]).children('div');

      columns.children('*').remove();

      var collections = [];

      for (var j = 0; j < columns.length; j++) {
        var o = new AmpersandCollection();
        for (var key in collection) {
          o[key] = collection[key];
        }
        o.models = [];

        collections.push(o);
      }

      for (var k = 0, l = 0; k < collection.models.length; k++, l = (l+1) % collections.length) {
        collections[l].models.push(collection.models[k]);
      }

      for (var m = 0; m < columns.length; m++) {
        this.renderCollection(collections[m], TopicView, columns[m]);
      }
    }
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

    tempCollection = this.collection;

    log('filtering by kind', kind);

    var aux = filterKind(tempCollection, kind);
    aux = filterClosed(aux,selectedClosed=='closed');
    aux = filterTag(aux,selectedTag);
    tempCollection = new AmpersandCollection(aux, {model: Topic});

    this.renderCards(tempCollection);

    this.queryByHook(selectedKind).classList.remove('selected');
    this.queryByHook(kind).classList.add('selected');

    selectedKind = kind;

    return false;
  },
  renderTagFilters: function () {
    var self = this;

    var filterContainer = $(self.queryByHook('tag-filters'));
    _.each(app.tags.serialize(), function (tag) {
      filterContainer.append('<li><div class=\'ink-button\' data-hook=\''+tag.id+'\'>'+tag.name+'</div></li>');
    });
  },
  handleTagFilter: function (ev) {
    var tag = ev.target.getAttribute('data-hook');

    tempCollection = this.collection;

    log('filtering by tag', tag);

    var aux = filterKind(tempCollection, selectedKind);
    aux = filterClosed(aux,selectedClosed=='closed');
    aux = filterTag(aux,tag);
    tempCollection = new AmpersandCollection(aux, {model: Topic});

    this.renderCards(tempCollection);

    this.queryByHook(selectedTag).classList.remove('selected');
    this.queryByHook(tag).classList.add('selected');

    selectedTag = tag;

    return false;
  },
  renderClosedFilters: function () {
    var self = this;

    var filterContainer = $(self.queryByHook('closed-filters'));
    filterContainer.append('<li><div class=\'ink-button\' data-hook=\'open\'>Open</div></li>');
    filterContainer.append('<li><div class=\'ink-button\' data-hook=\'closed\'>Closed</div></li>');
  },
  handleClosed: function (ev) {
    var closed = ev.target.getAttribute('data-hook');

    tempCollection = this.collection;

    log('filtering by closed', closed);

    var aux = filterKind(tempCollection, selectedKind);
    aux = filterClosed(aux,closed=='closed');
    aux = filterTag(aux,selectedTag);
    tempCollection = new AmpersandCollection(aux, {model: Topic});

    this.renderCards(tempCollection);

    this.queryByHook(selectedClosed).classList.remove('selected');
    this.queryByHook(closed).classList.add('selected');

    selectedClosed = closed;

    return false;
  },

  me: function () {
    log('Fetching my topics');
    var aux = this.collection.filter(function(topic){
      return topic.targets && topic.targets.indexOf(app.me.id) != -1;
    });

    aux = new AmpersandCollection(aux, {model: Topic});

    this.renderCards(aux);

    return false;
  },

  showall: function () {
    tempCollection = this.collection;
    this.renderCards(this.collection);

    this.queryByHook(selectedTag).classList.remove('selected');
    this.queryByHook(selectedKind).classList.remove('selected');
    this.queryByHook(selectedClosed).classList.remove('selected');

    this.queryByHook('showall').classList.add('selected');

    selectedTag = 'showall';
    selectedKind = 'showall';

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
