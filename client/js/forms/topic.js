/*global app*/
var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ArrayInputView = require('ampersand-array-input-view');
var ArrayCheckboxView = require('ampersand-array-checkbox-view');
var CheckboxView = require('ampersand-checkbox-view');
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
        name: 'status',
        label: 'Status',
        parent: this,
        options: options.kinds.topics.map(function(t) { return [t, t.toUpperCase()]; }),
        value: this.model && this.model.status || '',
        yieldModel: false
      }),
      new ExtendedInput({
        label: 'Name',
        name: 'name',
        value: this.model && this.model.name || '',
        required: false,
        placeholder: 'Name',
        parent: this
      }),
      new InputView({
        label: 'Text',
        name: 'text',
        template: templates.includes.formTextarea,
        value: this.model && this.model.text || '',
        required: false,
        placeholder: 'Text',
        parent: this
      }),
      new ArrayCheckboxView({
        label: 'Targets',
        name: 'targets',
        template: templates.includes.formCheckboxGroup(),
        fieldTemplate: templates.includes.formCheckboxGroupElement(),
        value: this.model && this.model.targets || [],
        options: app.members && app.members.map(function (m) { return [m.id, m.name]; }),
        minLength: 0,
        maxLength: 50,
        parent: this
      }),
      new ArrayCheckboxView({
        label: 'Tags',
        name: 'tags',
        template: templates.includes.formCheckboxGroup(),
        fieldTemplate: templates.includes.formCheckboxGroupElement(),
        value: this.model && this.model.tags || [],
        options: app.tags && app.tags.map(function (m) { return [m.id, m.name]; }),
        minLength: 0,
        maxLength: 50,
        parent: this
      }),
      new CheckboxView({
        label: 'Closed',
        name: 'closed',
        value: this.model && this.model.closed,
        parent: this
      }),
    ];
  }
});