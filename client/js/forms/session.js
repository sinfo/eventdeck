var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ArrayInputView = require('ampersand-array-input-view');
var SelectView = require('ampersand-select-view');
var templates = require('client/js/templates');
var ExtendedInput = InputView.extend({
  template: templates.includes.formInput()
});
var options = require('options');

module.exports = FormView.extend({
  fields: function () {
    return [
      new ExtendedInput({
        label: 'Name',
        name: 'name',
        value: this.model && this.model.name || '',
        required: true,
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
      new SelectView({
        template: templates.includes.formSelect(),
        name: 'kind',
        label: 'Kind',
        parent: this,
        options: options.kinds.sessions.map(function (s) { return s.name; }),
        unselectedText: 'Please choose one',
        required: true,
        value: this.model && this.model.kind || '',
        yieldModel: false,
      }),
      new ExtendedInput({
        label: 'Place',
        name: 'place',
        value: this.model && this.model.place || '',
        required: false,
        placeholder: 'Place',
        parent: this,
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
        name: 'session-date',
        value: this.model && this.model.date || '',
        required: true,
        placeholder: 'Date DD-MM-YYYY',
        parent: this
      }),
      new ExtendedInput({
        label: 'Duration',
        name: 'session-duration',
        value: this.model && this.model.duration || '',
        required: true,
        placeholder: 'Duration DD-MM-YYYY',
        parent: this
      }),
      new ArrayInputView({
        label: 'Speakers',
        name: 'session-speakers',
        value: this.model && this.model.speakers.map(function(r) {
          return r.id;
        }) || [],
        minLength: 0,
        parent: this
      }),
      new ArrayInputView({
        label: 'Companies',
        name: 'companies',
        value: this.model && this.model.companies || [],
        minLength: 0,
        parent: this
      })
    ];
  }
});