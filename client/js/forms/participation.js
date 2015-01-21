/*global app*/
var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SelectView = require('ampersand-select-view');
var DateView = require('ampersand-date-view');
var templates = require('client/js/templates');
var options = require('options');
var ExtendedInput = InputView.extend({
    template: templates.includes.formInput()
});

module.exports = FormView.extend({
  initialize: function() {
    var self = this;

    function addPollFields() {
      self.addField(new ExtendedInput({
        label: 'Kind',
        name: 'kind',
        value: self.model && self.model.kind || '',
        required: false,
        placeholder: 'Kind',
        parent: self
      }));
      self.addField(new ExtendedInput({
        label: 'Price',
        name: 'price',
        value: self.model && self.model.payment && self.model.payment.price || '',
        required: false,
        placeholder: 'Price',
        parent: self
      }));
      self.addField(new ExtendedInput({
        label: 'Invoice Number',
        name: 'invoice-number',
        value: self.model && self.model.payment && self.model.payment.invoice || '',
        required: false,
        placeholder: 'Invoice Number',
        parent: self
      }));
      self.addField(new DateView({
        label: 'Invoice Date',
        value: self.model && self.model.payment && self.model.payment.date || '',
        name: 'invoice-date'
      }));
      self.addField(new SelectView({
        template: templates.includes.formSelect(),
        name: 'invoice-status',
        label: 'Invoice Status',
        parent: self,
        options: options.statuses.payment.map(function(t) { return [t.id, t.name]; }),
        value: self.model && self.model.payment && self.model.payment.status || '',
        unselectedText: 'please choose one',
        yieldModel: false
      }));
      self.addField(new SelectView({
        template: templates.includes.formSelect(),
        name: 'invoice-via',
        label: 'Via',
        parent: self,
        options: options.vias.payment.map(function(t) { return [t.id, t.name]; }),
        value: self.model && self.model.payment && self.model.payment.via || '',
        unselectedText: 'please choose one',
        yieldModel: false
      }));
    }

    if(this.model && this.model.threadKind == 'company') {
      addPollFields();
    }
  },
  fields: function () {
    return [
      new SelectView({
        template: templates.includes.formSelect(),
        name: 'event',
        label: 'Event',
        parent: this,
        options: app.events,
        value: this.model && this.model.event || '',
        idAttribute: 'id',
        textAttribute: 'name',
        yieldModel: false
      }),
      new SelectView({
        template: templates.includes.formSelect(),
        name: 'member',
        label: 'Member',
        parent: this,
        options: app.members,
        value: this.model && this.model.member || '',
        idAttribute: 'id',
        textAttribute: 'name',
        yieldModel: false
      }),
      new SelectView({
        template: templates.includes.formSelect(),
        name: 'status',
        label: 'Status',
        parent: this,
        options: options.statuses[this.model && this.model.threadKind || 'company'].map(function (s) { return s.name; }),
        value: this.model && this.model.status || '',
        yieldModel: false
      })
    ];
  }
});