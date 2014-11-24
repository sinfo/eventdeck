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
        if(self.model.event){
          app.events.getOrFetch(self.model.event, {all: true}, function (err, model) {
            if (err) {
              log.error('couldnt find a event with id: ' + self.model.event);
            }
            self.model.eventDetails = model;
            log('Got event', model.name);
          });
        }
      }
    ], self.render);
  },
  render: function () {
    this.renderWithTemplate();
    this.viewContainer = this.queryByHook('view-container');
    this.switcher = new ViewSwitcher(this.viewContainer);
    if(!this.model.editing) {
      this.handleViewClick();
    } else {
      this.handleEditClick();
    }
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick',
    'click [data-hook~=action-edit]': 'handleEditClick',
    'click [data-hook~=action-view]': 'handleViewClick',
  },
  handleRemoveClick: function () {
    var self = this;
    self.parent.parent.parent.model.participations.remove(self.model);

    self.parent.parent.parent.model.save({
      wait: false,
      success: function () {
        log('participation saved', data);
        self.parent.handleViewClick();
      }
    });
    return false;
  },
  handleEditClick: function () {
    var view = new EditParticipation({ model: this.model, parent: this });
    this.switcher.set(view);
    this.model.editing = true;
    return false;
  },
  handleViewClick: function () {
    var view = new ViewParticipation({ model: this.model, parent: this });
    this.switcher.set(view);
    this.model.editing = false;
    return false;
  }
});

var ViewParticipation = View.extend({
  template: templates.partials.participations.view,
  bindings: {
    'model.eventDetails.name': '[data-hook~=event]',
    'model.memberDetails.name': '[data-hook~=member-name]',
    'model.statusDetails.name': '[data-hook~=status]',
    'model.statusDetails.style': {
      type: 'attribute',
      hook: 'status',
      name: 'style'
    },
    'model.kind': '[data-hook~=kind]',
    'model.memberDetails.img': {
      type: 'attribute',
      hook: 'member-img',
      name: 'src'
    },
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick'
  },
  handleRemoveClick: function () {
    self.model.set(data);

    self.parent.parent.parent.parent.model.save({
      wait: false,
      success: function () {
        log('participation saved', data);
        self.parent.handleViewClick();
      }
    });
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

            self.model.set(data);

            self.parent.parent.parent.parent.model.save({
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