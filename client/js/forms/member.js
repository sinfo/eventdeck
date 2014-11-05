var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ArrayInputView = require('ampersand-array-input-view');


module.exports = FormView.extend({
  fields: function () {
    return [
      new InputView({
        label: 'Id',
        name: 'id',
        value: this.model.id || '',
        required: false,
        placeholder: 'Id',
        parent: this
      }),
      new InputView({
        label: 'Name',
        name: 'name',
        value: this.model.name || '',
        required: false,
        placeholder: 'Name',
        parent: this
      }),
      new InputView({
        label: 'Img',
        name: 'img',
        value: this.model.img || '',
        required: false,
        placeholder: 'Img',
        parent: this
      }),
      new InputView({
        label: 'Skype',
        name: 'skype',
        value: this.model.skype || '',
        required: false,
        placeholder: 'Skype',
        parent: this
      }),
      new InputView({
        label: 'Facebook Username',
        name: 'facebook.username',
        value: this.model.facebook && this.model.facebook.username || '',
        required: false,
        placeholder: 'Facebook Username',
        parent: this
      }),
      new InputView({
        label: 'Main Mail',
        name: 'mails.main',
        value: this.model.mails && this.model.mails.main || '',
        required: false,
        parent: this
      }),
      new InputView({
        label: 'Institutional Mail',
        name: 'mails.institutional',
        value: this.model.mails && this.model.mails.institutional || '',
        required: false,
        parent: this
      }),
      new InputView({
        label: 'Dropbox Mail',
        name: 'mails.dropbox',
        value: this.model.mails && this.model.mails.dropbox || '',
        required: false,
        parent: this
      }),
      new InputView({
        label: 'Google Mail',
        name: 'mails.google',
        value: this.model.mails && this.model.mails.google || '',
        required: false,
        parent: this
      }),
      new InputView({
        label: 'Miscrosoft Mail',
        name: 'mails.microsoft',
        value: this.model.mails && this.model.mails.microsoft || '',
        required: false,
        parent: this
      }),
      new ArrayInputView({
        label: 'Phones',
        name: 'phones',
        value: this.model.phones || [],
        numberRequired: 0,
        parent: this
      })
    ];
  }
});