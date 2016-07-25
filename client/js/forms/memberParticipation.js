/*global app*/
var FormView = require('ampersand-form-view')
var SelectView = require('ampersand-select-view')
var templates = require('client/js/templates')
var options = require('options')

module.exports = FormView.extend({
  fields: function () {
    return [
      new SelectView({
        template: templates.includes.formSelect(),
        unselectedText: 'please choose one',
        name: 'event',
        label: 'Event',
        parent: this,
        options: app.events,
        value: this.model && this.model.event || '',
        idAttribute: 'id',
        textAttribute: 'name',
        yieldModel: false
      }),
      new SelectView({
        template: templates.includes.formSelect(),
        unselectedText: 'please choose one',
        name: 'role',
        label: 'Role',
        parent: this,
        options: options.roles.map(function (r) { return [r.id, r.name]; }),
        value: this.model && this.model.role || '',
        idAttribute: 'id',
        textAttribute: 'name',
        yieldModel: false
      })
    ]
  }
})
