/*global app*/
var log = require('bows')('participations');
var View = require('ampersand-view');
var templates = require('client/js/templates');
var ViewSwitcher = require('ampersand-view-switcher');
var ParticipationForm = require('client/js/forms/participation');
var MemberBadge = require('client/js/views/memberBadge');
var populate = require('client/js/helpers/populate');
var _ = require('client/js/helpers/underscore');

module.exports =  View.extend({
  template: templates.cards.participation,
  initialize: function (spec) {
    var self = this;
    if(self.model.event && !self.model.eventDetails){
      app.events.getOrFetch(self.model.event, {all: true}, function (err, model) {
        if (err) {
          log.error('couldnt find a event with id: ' + self.model.event);
        }
        self.model.eventDetails = model;
        self.render();
        // log('Got event', model.name);
      });
    }
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
        log('participation removed');
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

var ViewPayment = View.extend({
  template: templates.partials.participations.payment,
  bindings: {
    'model.kind': [
      { type: 'toggle', hook: 'kind' },
      { selector: '[data-hook~=kind] span' },
    ],
    'model.advertisementLvl': [
      { type: 'toggle', hook: 'advertisementLvl' },
      { selector: '[data-hook~=advertisementLvl] span' },
    ],
    'model.payment.price': [
      { type: 'toggle', hook: 'price' },
      { selector: '[data-hook~=price] span' },
    ],
    'model.payment.invoice': [
      { type: 'toggle', hook: 'invoice' },
      { selector: '[data-hook~=invoice] span' },
    ],
    'model.payment.date': [
      { type: 'toggle', hook: 'date' },
      { selector: '[data-hook~=date] span' },
    ],
    'model.payment.via': [
      { type: 'toggle', hook: 'via' },
      { selector: '[data-hook~=via] span' },
    ],
  },
  render: function() {
    var self = this;
    if(_.isEmpty(self.model.payment.serialize())) {
      return;
    }
    self.renderWithTemplate();
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
    'model.advertisementLvl': '[data-hook~=advertisementLvl]',
    'model.memberDetails.img': {
      type: 'attribute',
      hook: 'member-img',
      name: 'src'
    },
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick'
  },
  subviews: {
    payment: {
      container: '[data-hook=payment-container]',
      waitFor: 'model.payment',
      prepareView: function (el) {
        var self = this;
        return new ViewPayment({
          el: el,
          model: self.model
        });
      }
    },
    member: {
      container: '[data-hook=member-container]',
      waitFor: 'model.member',
      prepareView: function (el) {
        var self = this;
        return new MemberBadge({
          el: el,
          model: self.model
        });
      }
    },
  },
});

var EditParticipation = View.extend({
  template: templates.partials.participations.edit,
  subviews: {
    form: {
      container: '[data-hook~=new-participation]',
      parent: this,
      prepareView: function (el) {
        var self = this;
        var model = this.model;
        model.threadKind = self.parent.parent.parent.parent.model.threadKind;
        return new ParticipationForm({
          el: el,
          model: this.model,
          parent: self,
          submitCallback: function (data) {
            var changedAttributes = _.compactObject(self.model.changedAttributes(data));

            if(data['payment.price'] || data['payment.date'] || data['payment.invoice'] || data['payment.status'] || data['payment.via']) {
              data.payment = {
                price: data['payment.price'] || self.model.payment && self.model.payment.price,
                date: data['payment.date'] || self.model.payment && self.model.payment.date,
                invoice: data['payment.invoice'] || self.model.payment && self.model.payment.invoice,
                status: data['payment.status'] || self.model.payment && self.model.payment.status,
                via: data['payment.via'] || self.model.payment && self.model.payment.via,
              };

              delete  data['payment.price'];
              delete  data['payment.date'];
              delete  data['payment.invoice'];
              delete  data['payment.status'];
              delete  data['payment.via'];

              if(!changedAttributes) {
                changedAttributes = {};
              }

              changedAttributes.payment = data.payment;
            }

            log('data', data, changedAttributes);

            if(!changedAttributes) {
              return self.parent.handleViewClick();
            }

            self.model.set(changedAttributes);

            var parentModel = self.parent.parent.parent.parent.model;

            parentModel.save({participations: parentModel.participations.serialize() }, {
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