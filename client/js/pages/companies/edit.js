/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CompanyForm = require('client/js/forms/company');


module.exports = PageView.extend({
  pageTitle: 'Edit company',
  template: templates.pages.companies.edit,
  initialize: function (spec) {
    var self = this;
    app.companies.getOrFetch(spec.id, {all: true}, function (err, model) {
      if (err) alert('couldnt find a model with id: ' + spec.id);
      self.model = model;
    });
  },
  subviews: {
    form: {
      // this is the css selector that will be the `el` in the
      // prepareView function.
      container: 'form',
      // this says we'll wait for `this.model` to be truthy
      waitFor: 'model',
      prepareView: function (el) {
        var model = this.model;
        return new CompanyForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            delete(data.communications);
            delete(data.items);
            console.log(data);
            model.save(data, {
              wait: true,
              success: function (model, response, options) {
                app.navigate('/companies/'+model.id);
              },
              error: function (model, response, options) {
                console.log('error', response.statusCode, response.response);
              }
            });
          }
        });
      }
    }
  }
});
