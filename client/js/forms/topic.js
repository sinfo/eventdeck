var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ArrayInputView = require('ampersand-array-input-view');
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
        options: options.kinds.topics,
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
      new ArrayInputView({
        label: 'Targets',
        name: 'targets',
        value: this.model && this.model.targets || [],
        numberRequired: 0,
        parent: this
      }),
      new ArrayInputView({
        label: 'Tags',
        name: 'tags',
        value: this.model && this.model.tags || [],
        numberRequired: 0,
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