var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ArrayInputView = require('ampersand-array-input-view');
var templates = require('client/js/templates');
var ExtendedInput = InputView.extend({
    template: templates.includes.formInput()
});

module.exports = FormView.extend({
  fields: function () {
    return [
      new ExtendedInput({
        label: 'Event',
        name: 'event',
        value: this.model && this.model.event || '',
        required: false,
        placeholder: 'Event',
        parent: this
      }),
      new ExtendedInput({
        label: 'Member',
        name: 'member',
        value: this.model && this.model.member || '',
        required: false,
        placeholder: 'Member',
        parent: this
      }),
      new ExtendedInput({
        label: 'Status',
        name: 'status',
        value: this.model && this.model.status || '',
        required: false,
        placeholder: 'Status',
        parent: this
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