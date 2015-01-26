var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ArrayInputView = require('ampersand-array-input-view');
var SelectView = require('ampersand-select-view');
var DateView = require('ampersand-pikaday-view');
var templates = require('client/js/templates');
var ExtendedInput = InputView.extend({
  template: templates.includes.formInput()
});
var options = require('options');

var hours = function () {
  var hours = [];
  for (var i = 0; i<24; i++){
    hours.push('' + i);
  }
  return hours;
};

var minutes = function () {
  var minutes = [];
  for (var i = 0; i<60; i+=5){
    minutes.push('' + i);
  }
  return minutes;
};

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
      new DateView({
        label: 'Date',
        value: this.model && this.model.date || '',
        name: 'session-date'
      }),
      new SelectView({
        template: templates.includes.formSelect(),
        name: 'session-date-hours',
        label: 'Hours',
        parent: this,
        options: hours(),
        value: this.model && this.model.date.getHours() || '',
        unselectedText: 'Please choose one',
        required: true,
        yieldModel: false,
      }),
      new SelectView({
        template: templates.includes.formSelect(),
        name: 'session-date-minutes',
        label: 'Minutes',
        parent: this,
        options: minutes(),
        value: this.model && this.model.date.getMinutes() || '',
        unselectedText: 'Please choose one',
        required: true,
        yieldModel: false,
      }),
      new DateView({
        label: 'Duration',
        value: this.model && this.model.duration || '',
        name: 'session-duration'
      }),
      new SelectView({
        template: templates.includes.formSelect(),
        name: 'session-duration-hours',
        label: 'Hours',
        parent: this,
        options: hours(),
        value: this.model && this.model.duration.getHours() || '',
        unselectedText: 'Please choose one',
        required: true,
        yieldModel: false,
      }),
      new SelectView({
        template: templates.includes.formSelect(),
        name: 'session-duration-minutes',
        label: 'Minutes',
        parent: this,
        options: minutes(),
        value: this.model && this.model.duration.getMinutes() || '',
        unselectedText: 'Please choose one',
        required: true,
        yieldModel: false,
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