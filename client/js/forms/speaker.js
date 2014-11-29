var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ArrayInputView = require('ampersand-array-input-view');
var templates = require('client/js/templates');
var ExtendedInput = InputView.extend({
    template: templates.includes.formInput()
});

var TextareaInput = InputView.extend({
    template: templates.includes.formTextarea()
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
        label: 'Title',
        name: 'title',
        value: this.model && this.model.title || '',
        required: false,
        placeholder: 'Title',
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
        label: 'Image',
        name: 'image',
        value: this.model && this.model.img || '',
        required: false,
        placeholder: 'Image',
        parent: this
      }),
      new TextareaInput({
        label: 'Contacts',
        name: 'contacts',
        value: this.model && this.model.contacts || '',
        required: false,
        placeholder: 'Contacts',
        parent: this
      })
    ];
  }
});