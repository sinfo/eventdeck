/* global app, alert */
var log = require('bows')('companies')
var PageView = require('client/js/pages/base')
var templates = require('client/js/templates')
var CompanyForm = require('client/js/forms/company')
var _ = require('client/js/helpers/underscore')

module.exports = PageView.extend({
  pageTitle: 'Edit company',
  template: templates.pages.companies.edit,
  initialize: function (spec) {
    var self = this
    app.companies.getOrFetch(spec.id, function (err, model) {
      if (err) {
        return alert('couldnt find a model with id: ' + spec.id)
      }
      self.model = model
    })
  },
  subviews: {
    form: {
      container: '[data-hook=company-form]',
      waitFor: 'model',
      bindings: {
        'model.img': {
          type: 'attribute',
          hook: 'company-img',
          name: 'background'
        }
      },
      prepareView: function (el) {
        var self = this
        var model = this.model
        return new CompanyForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            data = self.model.changedAttributes(_.compactObject(data))
            if (!data) {
              return app.navigate('/companies/' + model.id)
            }
            self.model.save(data, {
              patch: true,
              wait: false,
              success: function (model, response, options) {
                app.navigate('/companies/' + model.id)
              },
              error: function (model, response, options) {
                log.error(response.statusCode + ' ' + response.response)
              }
            })
          }
        })
      }
    }
  }
})
