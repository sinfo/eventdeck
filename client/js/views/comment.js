var log = require('bows')('comments');
var View = require('ampersand-view');
var templates = require('client/js/templates');
var ViewSwitcher = require('ampersand-view-switcher');
var CommentForm = require('client/js/forms/comment');
var _ = require('client/js/helpers/underscore');

module.exports = View.extend({
  template: templates.cards.comment,
  render: function () {
    this.renderWithTemplate();
    this.viewContainer = this.queryByHook('view-container');
    this.switcher = new ViewSwitcher(this.viewContainer);

    this.handleViewClick();
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick',
    'click [data-hook~=action-edit]': 'handleEditClick',
    'click [data-hook~=action-view]': 'handleViewClick',
  },
  handleRemoveClick: function () {
    this.model.destroy({wait: true});
    return false;
  },
  handleEditClick: function () {
    var view = new EditCommunication({ model: this.model, parent: this });
    this.switcher.set(view);
    return false;
  },
  handleViewClick: function () {
    var view = new ViewCommunication({ model: this.model, parent: this });
    this.switcher.set(view);
    return false;
  },
});


var ViewComment = View.extend({
  template: templates.partials.comments.view,
  bindings: {
    'model.postedTimeSpan': '[data-hook~=posted]',
    'model.posted': {
      type: 'attribute',
      hook: 'posted',
      name: 'title'
    },
    'model.text': '[data-hook~=text]',
    'model.memberName': '[data-hook~=member-name]'
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick'
  },
  handleRemoveClick: function () {
    this.model.destroy();
    return false;
  },
  render: function () {
    this.renderWithTemplate();
    if(app.me.isAdmin) {
      this.renderSubview(new AdminCommunication(), '[data-hook=admin-container]');
    }
  }
});


var EditCommunication = View.extend({
  template: templates.partials.comments.edit,
  subviews: {
    form: {
      container: '[data-hook~=new-comment]',
      prepareView: function (el) {
        var self = this;
        var model = this.model;
        return new CommentForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            data = self.model.changedAttributes(_.compactObject(data));
            if(!data) {
              return self.parent.handleViewClick();
            }
            self.model.save(data, {
              patch: true,
              wait: false,
              success: function () {
                log('comment saved', data);
                self.parent.handleViewClick();
              }
            });
          }
        });
      }
    }
  }
});


var AdminCommunication = View.extend({
  template: templates.partials.comments.admin,
});


