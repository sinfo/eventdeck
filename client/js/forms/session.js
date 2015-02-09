/*global app*/
var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ArrayInputView = require('ampersand-array-input-view');
var ChosenView = require('ampersand-chosen-view');
var CheckBoxView = require('ampersand-checkbox-view');
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
        // template: templates.includes.formSelect(),
        name: 'session-date-hours',
        label: 'Hours',
        parent: this,
        options: hours(),
        value: this.model && this.model.date.getHours() || '',
        unselectedText: 'Please choose one',
        required: false,
        yieldModel: false,
      }),
      new SelectView({
        // template: templates.includes.formSelect(),
        name: 'session-date-minutes',
        label: 'Minutes',
        parent: this,
        options: minutes(),
        value: this.model && this.model.date.getMinutes() || '',
        unselectedText: 'Please choose one',
        required: false,
        yieldModel: false,
      }),
      new DateView({
        label: 'End',
        value: this.model && this.model.end || '',
        name: 'session-end'
      }),
      new SelectView({
        // template: templates.includes.formSelect(),
        name: 'session-end-hours',
        label: 'Hours',
        parent: this,
        options: hours(),
        value: this.model && this.model.end.getHours() || '',
        unselectedText: 'Please choose one',
        required: false,
        yieldModel: false,
      }),
      new SelectView({
        // template: templates.includes.formSelect(),
        name: 'session-end-minutes',
        label: 'Minutes',
        parent: this,
        options: minutes(),
        value: this.model && this.model.end.getMinutes() || '',
        unselectedText: 'Please choose one',
        required: false,
        yieldModel: false,
      }),
      new ChosenView({
        label: 'Speakers',
        name: 'session-speakers',
        unselectedText: 'Select one or more',
        value: this.model && this.model.speakers.map(function(r) {
          return r.id;
        }) || [],
        isMultiple: true,
        options: app.speakers && app.speakers.map(function (m) { return [m.id, m.name]; }),
      }),
      new ChosenView({
        label: 'Companies',
        name: 'companies',
        unselectedText: 'Select one or more',
        value: this.model && this.model.companies,
        isMultiple: true,
        options: app.companies && app.companies.map(function (m) { return [m.id, m.name]; }),
      }),
      new CheckBoxView({
        name: 'tickets.needed',
        label: 'Tickets Required',
        value: this.model && this.model.tickets && this.model.tickets.needed || false,
        required: false,
        validClass: 'input-valid',
        invalidClass: 'input-invalid',
        requiredMessage: 'This box must be checked.',
        parent:  this
      }),
      new DateView({
        label: 'Date to start ticket distribution',
        value: this.model && this.model.tickets && this.model.tickets.start || '',
        name: 'tickets.start'
      }),
      new DateView({
        label: 'Date to end ticket distribution',
        value: this.model && this.model.tickets && this.model.tickets.end || '',
        name: 'tickets.end'
      }),
      new ExtendedInput({
        label: 'Number of Tickets',
        name: 'tickets.max',
        value: this.model && this.model.tickets && this.model.tickets.max || '',
        required: false,
        placeholder: 'Number of Tickets',
        parent: this
      }),
    ];
  }
});