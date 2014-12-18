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
        value: this.model && this.model.name || '',
        required: false,
        placeholder: 'Name',
        parent: this
      }),
      new ExtendedInput({
        label: 'Img',
        name: 'img',
        value: this.model && this.model.img || '',
        required: false,
        placeholder: 'Img',
        parent: this
      }),
//      new ArrayInputView({
//        label: 'Roles',
//        name: 'roles',
//        value: this.model && this.model.roles.map(function(r) {
//          return r.id;
//        }) || [],
//        minLength: 0,
//        parent: this
//      }),
//      new ArrayInputView({
//        label: 'Phones',
//        name: 'phones',
//        value: this.model && this.model.phones || [],
//        minLength: 0,
//        parent: this
//      })
    ];
  }
});