var log = require('bows')('communications');
var View = require('ampersand-view');
var templates = require('client/js/templates');
var ViewSwitcher = require('ampersand-view-switcher');
var CommunicationForm = require('client/js/forms/communication');

module.exports = View.extend({
  template: templates.cards.communication,
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
    'click [data-hook~=action-approve]': 'handleApproveClick',
    'click [data-hook~=action-review]': 'handleReviewClick',
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
  handleApproveClick: function () {
    this.model.save({ status: 'approved' }, {
      patch: true,
      wait: false,
      success: function () {
        log('communication approved');
      }
    });
    return false;
  },
  handleReviewClick: function () {
    this.model.save({ status: 'reviewed' }, {
      patch: true,
      wait: false,
      success: function () {
        log('communication reviewed');
      }
    });
    return false;
  },
});


var ViewCommunication = View.extend({
  template: templates.partials.communications.view,
  bindings: {
    'model.kind': '[data-hook~=kind]',
    'model.statusDetails.name': '[data-hook~=status]',
    'model.statusDetails.style': {
      type: 'attribute',
      hook: 'status',
      name: 'style'
    },
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
  template: templates.partials.communications.edit,
  subviews: {
    form: {
      container: '[data-hook~=new-commmunication]',
      prepareView: function (el) {
        var self = this;
        var model = this.model;
        return new CommunicationForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            data = self.model.changedAttributes(data);
            if(!data) {
              return self.parent.handleViewClick();
            }
            self.model.save(data, {
              patch: true,
              wait: false,
              success: function () {
                log('communication saved', data);
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
  template: templates.partials.communications.admin,
});


