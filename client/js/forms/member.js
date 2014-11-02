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
      new ArrayInputView({
        label: 'Roles',
        name: 'roles',
        value: this.model && this.model.roles || [],
        minLength: 0,
        parent: this
      }),
      new InputView({
        label: 'Skype',
        name: 'skype',
        value: this.model && this.model.skype || '',
        required: false,
        placeholder: 'Skype',
        parent: this
      }),
      new ArrayInputView({
        label: 'Phones',
        name: 'phones',
        value: this.model && this.model.phones || [],
        minLength: 0,
        parent: this
      })
    ];
  }
});