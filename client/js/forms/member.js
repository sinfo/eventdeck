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
        label: 'Id',
        name: 'id',
        value: this.model && this.model.id || '',
        required: false,
        placeholder: 'Id',
        parent: this
      }),
      new ExtendedInput({
        label: 'Name',
        name: 'name',
        value: this.model && this.model.name || '',
        required: false,
        placeholder: 'Name',
        parent: this
      }),
      new ExtendedInput({
        label: 'Image',
        name: 'img',
        value: this.model && this.model.img || '',
        required: false,
        placeholder: 'Image',
        parent: this
      }),
      new ExtendedInput({
        label: 'Skype',
        name: 'skype',
        value: this.model && this.model.skype || '',
        required: false,
        placeholder: 'Skype',
        parent: this
      }),
      new ExtendedInput({
        label: 'Facebook Username',
        name: 'facebook.username',
        value: this.model && this.model.facebook && this.model.facebook.username || '',
        required: false,
        placeholder: 'Facebook Username',
        parent: this
      }),
      new ExtendedInput({
        label: 'Main Mail',
        name: 'mails.main',
        value: this.model && this.model.mails && this.model.mails.main || '',
        required: false,
        parent: this
      }),
      new ExtendedInput({
        label: 'Institutional Mail',
        name: 'mails.institutional',
        value: this.model && this.model.mails && this.model.mails.institutional || '',
        required: false,
        parent: this
      }),
      new ExtendedInput({
        label: 'Dropbox Mail',
        name: 'mails.dropbox',
        value: this.model && this.model.mails && this.model.mails.dropbox || '',
        required: false,
        parent: this
      }),
      new ExtendedInput({
        label: 'Google Mail',
        name: 'mails.google',
        value: this.model && this.model.mails && this.model.mails.google || '',
        required: false,
        parent: this
      }),
      new ExtendedInput({
        label: 'Microsoft Mail',
        name: 'mails.microsoft',
        value: this.model && this.model.mails && this.model.mails.microsoft || '',
        required: false,
        parent: this
      }),
      new ArrayInputView({
        label: 'Roles',
        name: 'roles',
        value: this.model && this.model.roles.map(function(r) {
          return r.id;
        }) || [],
        minLength: 0,
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