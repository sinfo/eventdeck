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
        label: 'Name',
        name: 'name',
        el: this.el.querySelector('#company-name'),
        value: this.model && this.model.name || '',
        required: false,
        placeholder: 'Name',
        parent: this
      }),
      new ExtendedInput({
        label: 'Image',
        name: 'image',
        value: this.model && this.model.img || '',
        required: false,
        placeholder: 'Image',
        parent: this
      }),
      new ExtendedInput({
        label: 'Area',
        name: 'area',
        value: this.model && this.model.area || '',
        required: false,
        placeholder: 'Area',
        parent: this
      }),
      new ExtendedInput({
        label: 'Site',
        name: 'site',
        value: this.model && this.model.site || '',
        required: false,
        placeholder: 'Site',
        parent: this
      }),
      new ExtendedInput({
        label: 'Contacts',
        name: 'contacts',
        value: this.model && this.model.contacts || '',
        required: false,
        placeholder: 'Contacts',
        parent: this
      }),
      new ExtendedInput({
        label: 'Description',
        name: 'description',
        value: this.model && this.model.description || '',
        required: false,
        placeholder: 'Description',
        parent: this
      }),
      new ExtendedInput({
        label: 'History',
        name: 'history',
        value: this.model && this.model.history || '',
        required: false,
        placeholder: 'History',
        parent: this
      }),
    ];
  }
});