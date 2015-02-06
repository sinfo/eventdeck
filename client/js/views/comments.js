var log = require('bows')('comments');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CommentView = require('client/js/views/comment');
var CommentForm = require('client/js/forms/comment');

module.exports = PageView.extend({
  template: templates.partials.comments.area,
  events: {
    'click [data-hook~=fetch]': 'fetchCollection',
    'click [data-hook~=add]': 'addNew'
  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, CommentView, this.queryByHook('comments-list'));
    if (!this.collection.length) {
      this.fetchCollection();
    }
  },
  fetchCollection: function () {
    log('Fetching comments');
    this.collection.fetch();
    return false;
  },
  addNew: function () {
    var self = this;

    this.collection.add({
      editing: true,
      thread: self.parent.model.thread,
      subthread: self.parent.model.subthread
    });
  }
});
