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

    if(this.model && this.model.threadKind == 'company') {
      _addPollFields(self);
    }
  },
  fields: function () {
    return [
      new SelectView({
        template: templates.includes.formSelect(),
        unselectedText: 'please choose one',
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
        unselectedText: 'please choose one',
        name: 'member',
        label: 'Member',
        parent: this,
        options: this.model.membersList,
        value: this.model && this.model.member || '',
        idAttribute: 'id',
        textAttribute: 'name',
        yieldModel: false
      }),
      new SelectView({
        template: templates.includes.formSelect(),
        unselectedText: 'please choose one',
        name: 'status',
        label: 'Status',
        parent: this,
        options: options.statuses[this.model && this.model.threadKind || 'company'].map(function (s) { return [s.id, s.name]; }),
        value: this.model && this.model.status || '',
        yieldModel: false
      })
    ];
  }
});

function _addPollFields (view) {
  view.addField(new ExtendedInput({
    label: 'Kind',
    name: 'kind',
    value: view.model && view.model.kind || '',
    required: false,
    placeholder: 'Kind',
    parent: view
  }));
  view.addField(new SelectView({
    template: templates.includes.formSelect(),
    unselectedText: 'please choose one',
    label: 'Advertisement Level',
    name: 'advertisementLvl',
    parent: view,
    options: options.advertisementLvl.map(function(t) { return [t.id, t.name]; }),
    value: view.model && view.model.advertisementLvl,
    yieldModel: false
  }));
  view.addField(new ExtendedInput({
    label: 'Price',
    name: 'payment.price',
    value: view.model && view.model.payment && view.model.payment.price || '',
    required: false,
    placeholder: 'Price',
    parent: view
  }));
  view.addField(new ExtendedInput({
    label: 'Invoice Number',
    name: 'payment.invoice',
    value: view.model && view.model.payment && view.model.payment.invoice || '',
    required: false,
    placeholder: 'Invoice Number',
    parent: view
  }));
  view.addField(new DateView({
    label: 'Invoice Date',
    value: view.model && view.model.payment && view.model.payment.date || '',
    name: 'payment.date'
  }));
  view.addField(new SelectView({
    template: templates.includes.formSelect(),
    unselectedText: 'please choose one',
    name: 'payment.status',
    label: 'Invoice Status',
    parent: view,
    options: options.statuses.payment.map(function(t) { return [t.id, t.name]; }),
    value: view.model && view.model.payment && view.model.payment.status || '',
    yieldModel: false
  }));
  view.addField(new SelectView({
    template: templates.includes.formSelect(),
    unselectedText: 'please choose one',
    name: 'payment.via',
    label: 'Via',
    parent: view,
    options: options.vias.payment.map(function(t) { return [t.id, t.name]; }),
    value: view.model && view.model.payment && view.model.payment.via || '',
    yieldModel: false
  }));
}