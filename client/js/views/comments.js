var log = require('bows')('comments');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CommentView = require('client/js/views/comment');
var CommentForm = require('client/js/forms/comment');

module.exports = PageView.extend({
  template: templates.partials.comments.area,
  events: {
    'click [data-hook~=fetch]': 'fetchCollection',
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
  subviews: {
    form: {
      container: '[data-hook~=new-comment]',
      prepareView: function (el) {
        var self = this;
        return new CommentForm({
          el: el,
          submitCallback: function (data) {
            var comment = {
              thread: self.parent.model.thread,
              subthread: self.parent.model.subthread,
              text: data.text
            };

            self.collection.create(comment, {
              wait: true,
              success: function () {
                self.fetchCollection();
                log('new comment created', comment);
              }
            });
          }
        });
      }
    }
  }
});
