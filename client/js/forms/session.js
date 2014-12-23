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
      new ExtendedInput({
        label: 'Kind',
        name: 'kind',
        value: this.model && this.model.kind || '',
        required: false,
        placeholder: 'Kind',
        parent: this
      }),
      new ExtendedInput({
        label: 'Place',
        name: 'place',
        value: this.model && this.model.place || '',
        required: false,
        placeholder: 'Place',
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
        label: 'Date',
        name: 'date',
        value: this.model && this.model.date || '',
        required: false,
        placeholder: 'Date',
        parent: this
      }),
      new ExtendedInput({
        label: 'Duration',
        name: 'duration',
        value: this.model && this.model.duration || '',
        required: false,
        placeholder: 'Duration',
        parent: this
      }),
      new ArrayInputView({
        label: 'Speakers',
        name: 'speakers',
        fieldTemplate: '<label><div><span>Name</span><input name=\"id\" type=\"text\"></div><div><span>Name</span><input name=\"name\" type=\"text\"></div><div><span>Position</span><input name=\"position\" type=\"text\"></div><div style=\"display: none;\" data-anddom-hidden=\"true\" data-anddom-display=\"\" data-hook=\"message-container\" class=\"message message-below message-error\"><p data-hook=\"message-text\"></p></div><a style=\"display: none;\" data-anddom-hidden=\"true\" data-anddom-display=\"\" data-hook=\"remove-field\">remove</a></label>',
        value: this.model && this.model.speakers || [],
        minLength: 0,
        parent: this
      }),
      new ArrayInputView({
        label: 'Companies',       
        name: 'companies',
        value: this.model && this.model.companies.map(function(r) {
          return r.id;
        }) || [],
        minLength: 0,
        parent: this
      })
    ];
  }
});