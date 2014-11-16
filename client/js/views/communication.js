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
    'click [data-hook~=action-view]': 'handleViewClick'
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
  }
});


var ViewCommunication = View.extend({
  template: templates.partials.communications.view,
  bindings: {
    'model.kind': '[data-hook~=kind]',
    'model.status': '[data-hook~=status]',
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