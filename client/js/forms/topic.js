/*global app*/
var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ArrayInputView = require('ampersand-array-input-view');
var ArrayCheckboxView = require('ampersand-array-checkbox-view');
var CheckboxView = require('ampersand-checkbox-view');
var SelectView = require('ampersand-select-view');
var DateView = require('ampersand-pikaday-view');
var ChosenView = require('ampersand-chosen-view');
var templates = require('client/js/templates');
var options = require('options');
var ExtendedInput = InputView.extend({
    template: templates.includes.formInput()
});


module.exports = FormView.extend({
  initialize: function() {
    var self = this;

    function addPollFields() {
      self.addField(new SelectView({
        template: templates.includes.formSelect(),
        name: 'poll-kind',
        label: 'Poll kind',
        parent: self,
        options: options.kinds.polls.map(function(t) { return [t.id, t.name]; }),
        value: self.model && self.model.poll.kind || '',
        unselectedText: 'please choose one',
        yieldModel: false
      }));
      self.addField(new ArrayInputView({
        template: templates.includes.formInputGroup(),
        fieldTemplate: templates.includes.formInputGroupElement(),
        label: 'Poll options',
        name: 'poll-options',
        value: self.model && self.model.poll.options.map(function(o) { return o.content; }) || [],
        maxLength: 50,
        parent: self
      }));
    }

    if(self.model && self.model.kind == 'decision') {
      addPollFields();
    }

    self.on('change:kind', function (data) {
      if(data.value == 'decision') {
        addPollFields();
      } else {
        self.removeField('poll-options');
        self.removeField('poll-kind');
      }
    });
  },
  fields: function () {
    return [
      new SelectView({
        template: templates.includes.formSelect(),
        name: 'kind',
        label: 'Kind',
        parent: this,
        options: options.kinds.topics.map(function(t) { return [t.id, t.name]; }),
        value: this.model && this.model.kind || '',
        unselectedText: 'please choose one',
        yieldModel: false
      }),
      new ExtendedInput({
        label: 'Name',
        name: 'name',
        value: this.model && this.model.name || '',
        required: false,
        placeholder: 'Name',
        parent: this
      }),
      new InputView({
        label: 'Text',
        name: 'text',
        template: templates.includes.formTextarea,
        value: this.model && this.model.text || '',
        required: false,
        placeholder: 'Text',
        parent: this
      }),
      new ChosenView({
          label: 'Targets',
          name: 'targets',
          unselectedText: 'Select one or more',
          value: this.model && this.model.targets || [],
          isMultiple: true,
          options: app.members && app.members.map(function (m) { return [m.id, m.name]; }),
      }),
      new ChosenView({
          label: 'Tags',
          name: 'tags',
          unselectedText: 'Select one or more',
          value: this.model && this.model.tags || [],
          isMultiple: true,
          options: app.tags && app.tags.map(function (m) { return [m.id, m.name]; }),
      }),
      new DateView({
        label: 'Due Date',
        value: this.model && this.model.duedate || '',
        name: 'duedate'
      }),
      new CheckboxView({
        label: 'Closed',
        name: 'closed',
        value: this.model && this.model.closed,
        parent: this
      }),
    ];
  }
});