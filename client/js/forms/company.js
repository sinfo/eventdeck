var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ArrayInputView = require('ampersand-array-input-view');

module.exports = FormView.extend({
  fields: function () {
    return [
      new InputView({
        label: 'Id',
        name: 'id',
        value: this.model && this.model.id || '',
        required: false,
        placeholder: 'Id',
        parent: this
      }),
      new InputView({
        label: 'Name',
        name: 'name',
        value: this.model && this.model.name || '',
        required: false,
        placeholder: 'Name',
        parent: this
      }),
      new InputView({
        label: 'Url',
        name: 'url',
        value: this.model && this.model.url || '',
        required: false,
        placeholder: 'Url',
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
      new ArrayInputView({
        label: 'Participations',
        name: 'participations',
        value: this.model && this.model.participations || [],
        minLength: 0,
        parent: this
      }),
      new ArrayInputView({
        label: 'Items',
        name: 'items',
        value: this.model && this.model.items || [],
        minLength: 0,
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
    ];
  }
});