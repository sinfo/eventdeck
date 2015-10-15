/*global app*/
var log = require('bows')('member-participations');
var View = require('ampersand-view');
var templates = require('client/js/templates');
var ViewSwitcher = require('ampersand-view-switcher');
var MemberParticipationForm = require('client/js/forms/memberParticipation');
var _ = require('client/js/helpers/underscore');

module.exports = View.extend({
  template: templates.cards.participation,
  initialize: function (spec) {
    var self = this;
    log('initing');
    if (self.model.event && !self.model.eventDetails) {
      app.events.getOrFetch(self.model.event, {all: true}, function (err, model) {
        if (err) {
          log.error('couldnt find a event with id: ' + self.model.event);
        }
        self.model.eventDetails = model;
      // self.render();
      // log('Got event', model.name);
      });
    }
  },
  render: function () {
    this.renderWithTemplate();
    this.viewContainer = this.queryByHook('view-container');
    this.switcher = new ViewSwitcher(this.viewContainer);
    if (!this.model.editing) {
      this.handleViewClick();
    } else {
      this.handleEditClick();
    }
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick',
    'click [data-hook~=action-edit]': 'handleEditClick',
    'click [data-hook~=action-view]': 'handleViewClick'
  },
  handleRemoveClick: function () {
    var self = this;
    self.parent.parent.model.participations.remove(self.model);

    self.parent.parent.model.save({
      wait: false,
      success: function () {
        log('participation removed');
        self.parent.handleViewClick();
      }
    });
    return false;
  },
  handleEditClick: function () {
    var view = new EditParticipation({ model: this.model, parent: this });
    this.switcher.set(view);
    // this.model.editing = true;
    return false;
  },
  handleViewClick: function () {
    var view = new ViewParticipation({ model: this.model, parent: this });
    this.switcher.set(view);
    // this.model.editing = false;
    return false;
  }
});

var ViewParticipation = View.extend({
  template: templates.partials.participations.memberView,
  bindings: {
    'model.eventDetails.name': '[data-hook~=event]',
    'model.roleName': '[data-hook~=role]'
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick'
  }
});

var EditParticipation = View.extend({
  template: templates.partials.participations.edit,
  render: function () {
    this.renderWithTemplate();
  },
  subviews: {
    form: {
      container: '[data-hook~=new-participation]',
      parent: this,
      prepareView: function (el) {
        var self = this;
        var model = this.model;
        return new MemberParticipationForm({
          el: el,
          model: model,
          parent: self,
          submitCallback: function (data) {
            var changedAttributes = _.compactObject(self.model.changedAttributes(data));

            log('data', data, changedAttributes);

            if (!changedAttributes) {
              return self.parent.handleViewClick();
            }

            self.model.set(changedAttributes);

            var parentModel = self.parent.parent.parent.model;

            parentModel.save({ participations: parentModel.participations.serialize() }, {
              patch: true,
              wait: false,
              success: function () {
                log('participation saved', data);
                self.parent.handleViewClick();
              }
            });
          }
        });
      }
    }
  }
});
