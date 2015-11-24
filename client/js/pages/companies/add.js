/*global app*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CompanyForm = require('client/js/forms/company');
var _ = require('client/js/helpers/underscore');


module.exports = PageView.extend({
  pageTitle: 'Add company',
  template: templates.pages.companies.add,
  subviews: {
    form: {
      container: 'form',
      prepareView: function (el) {
        return new CompanyForm({
          el: el,
          submitCallback: function (data) {
            data = _.compactObject(data);

            app.companies.create(data, {
              wait: true,
              success: function (model, response, options) {
                app.navigate('/companies/'+model.id);
                app.companies.fetch();
              },
              error: function(response){
                window.alert('This company already exists.');
                app.navigate('');
              },
            });
          }
        });
      }
    }
  }
});
