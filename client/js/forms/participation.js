/*global app*/
var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SelectView = require('ampersand-select-view');
var templates = require('client/js/templates');
var options = require('options');
var ExtendedInput = InputView.extend({
    template: templates.includes.formInput()
});

module.exports = FormView.extend({
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
      }),
      new ExtendedInput({
        label: 'Kind',
        name: 'kind',
        value: this.model && this.model.kind || '',
        required: false,
        placeholder: 'Kind',
        parent: this
      })
    ];
  }
});