/* global app */
var FormView = require('ampersand-form-view')
var InputView = require('ampersand-input-view')
var SelectView = require('ampersand-select-view')
var templates = require('../templates')
var options = require('../../../options')

module.exports = FormView.extend({
  fields: function () {
    return [
      new SelectView({
        name: 'event',
        label: 'Event',
        parent: this,
        options: app.events,
        value: this.model && this.model.event || app.me.selectedEvent,
        idAttribute: 'id',
        textAttribute: 'name',
        yieldModel: false
      }),
      new SelectView({
        label: 'Kind',
        name: 'kind',
        value: this.model && this.model.kind || options.kinds.communications[0],
        options: options.kinds.communications,
        parent: this
      }),
      new InputView({
        label: '',
        name: 'text',
        template: templates.includes.formTextarea,
        value: this.model && this.model.text || '',
        placeholder: 'Communication content',
        required: true,
        parent: this
      })
    ]
  }
})
