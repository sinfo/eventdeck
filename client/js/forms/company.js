var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ArrayInputView = require('ampersand-array-input-view');

module.exports = FormView.extend({
  fields: function () {
    return [
      new InputView({
        label: 'Name',
        name: 'name',
        el: this.el.querySelector('#company-name'),
        value: this.model && this.model.name || '',
        required: false,
        placeholder: 'Name',
        parent: this
      }),
      new InputView({
        label: 'Image',
        name: 'image',
        value: this.model && this.model.img || '',
        required: false,
        placeholder: 'Image',
        parent: this
      }),
      new InputView({
        label: 'Area',
        name: 'area',
        value: this.model && this.model.area || '',
        required: false,
        placeholder: 'Area',
        parent: this
      }),
      new InputView({
        label: 'Site',
        name: 'site',
        value: this.model && this.model.site || '',
        required: false,
        placeholder: 'Site',
        parent: this
      }),
      new InputView({
        label: 'Contacts',
        name: 'contacts',
        value: this.model && this.model.contacts || '',
        required: false,
        placeholder: 'Contacts',
        parent: this
      }),
      new InputView({
        label: 'Description',
        name: 'description',
        value: this.model && this.model.description || '',
        required: false,
        placeholder: 'Description',
        parent: this
      }),
      new InputView({
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