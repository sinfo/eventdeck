/*global app*/
var log = require('bows')('participations');
var View = require('ampersand-view');
var templates = require('client/js/templates');
var ViewSwitcher = require('ampersand-view-switcher');
var ParticipationForm = require('client/js/forms/participation');
var async = require('async');

module.exports =  View.extend({
  template: templates.cards.participation,
  initialize: function (spec) {
    var self = this;
    async.parallel([
      function getMember (cb){
        if(self.model.member){
          app.members.getOrFetch(self.model.member, {all: true}, function (err, model) {
            if (err) {
              log.error('couldnt find a member with id: ' + self.model.member);
              return cb();
            }
            self.model.memberDetails = model;
            log('Got member', model.name);
            cb();
          });
        }
      },
      function getEvent (cb){
        app.events.getOrFetch(self.model.event, {all: true}, function (err, model) {
          if (err) {
            log.error('couldnt find a event with id: ' + self.model.event);
          }
          self.model.eventDetails = model;
          log('Got event', model.name);
        });
      }
    ], self.render);
  },
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
    var view = new EditParticipation({ model: this.model, parent: this });
    this.switcher.set(view);
    return false;
  },
  handleViewClick: function () {
    var view = new ViewParticipation({ model: this.model, parent: this });
    this.switcher.set(view);
    return false;
  }
});

var ViewParticipation = View.extend({
  template: templates.partials.participations.view,
  bindings: {
    'model.eventDetails.name': '[data-hook~=event]',
    'model.memberDetails.name': '[data-hook~=member]',
    'model.status': '[data-hook~=status]',
    'model.kind': '[data-hook~=kind]'
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
  }
});

var EditParticipation = View.extend({
  template: templates.partials.participations.edit,
  subviews: {
    form: {
      container: '[data-hook~=new-participation]',
      prepareView: function (el) {
        var self = this;
        var model = this.model;
        return new ParticipationForm({
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