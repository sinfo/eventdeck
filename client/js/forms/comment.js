var FormView = require('ampersand-form-view')
var InputView = require('ampersand-input-view')
var templates = require('../templates')

module.exports = FormView.extend({
  fields: function () {
    return [
      new InputView({
        label: '',
        name: 'text',
        template: templates.includes.formTextarea,
        value: this.model && this.model.text || '',
        placeholder: 'Comment content',
        required: true,
        parent: this
      })
    ]
  }
})
