/* global app */
var FormView = require('ampersand-form-view')
var ArrayCheckboxView = require('ampersand-array-checkbox-view')
var templates = require('../templates')

module.exports = FormView.extend({
  fields: function () {
    var options = this.model && this.model.poll.options.serialize().map(function (o) { return o.content })
    var value = this.model && this.model.poll.options.serialize().map(function (o) {
      return o.votes.indexOf(app.me.id) !== -1 && o.content
    }).filter(function (o) {
      return o
    })

    return [
      new ArrayCheckboxView({
        label: 'Poll',
        name: 'poll',
        template: templates.includes.formCheckboxGroup(),
        fieldTemplate: templates.includes.formCheckboxGroupElement(),
        options: options,
        value: value,
        minLength: 0,
        maxLength: 50,
        parent: this
      })
    ]
  }
})
