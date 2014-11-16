var FormView = require('ampersand-form-view');
var InputView = require('ampersand-select-view');
var SelectView = require('ampersand-select-view');

module.exports = FormView.extend({
  fields: function () {
    return [
      new SelectView({
        name: 'event',
        label: 'Event',
        parent: this,
        options: app.events,
        value: this.model.events,
        idAttribute: 'id',
        textAttribute: 'name',
        // yieldModel: false
      }),
      new SelectView({
        name: 'event',
        label: 'Event',
        parent: this,
        options: app.events,
        value: this.model.event || '',
        idAttribute: 'id',
        textAttribute: 'name',
        // yieldModel: false
      }),
      new SelectView({
        label: 'Kind',
        name: 'kind',
        value: this.model && this.model.kind || '',
        required: true,
        options: app.events,
        idAttribute: 'id',
        textAttribute: 'name',
        parent: this
      }),
      new InputView({
        label: 'Text',
        name: 'text',
        value: this.model && this.model.text || '',
        required: false,
        placeholder: 'text',
        parent: this
      })
    ];
  }
});