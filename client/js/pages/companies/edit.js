/*global app, alert*/
var ViewSwitcher = require('ampersand-view-switcher');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CompanyForm = require('client/js/forms/company');
var ParticipationsView = require('client/js/views/participations');
var _ = require('client/js/helpers/underscore');


module.exports = PageView.extend({
  pageTitle: 'Edit company',
  template: templates.pages.companies.edit,
  initialize: function (spec) {
    var self = this;
    app.companies.getOrFetch(spec.id, {all: true}, function (err, model) {
      if (err) {
        return alert('couldnt find a model with id: ' + spec.id);
      }
      self.model = model;
      self.render();
    });
  },
  render: function () {
    this.renderWithTemplate();
    this.viewContainer = this.queryByHook('view-container');
    this.switcher = new ViewSwitcher(this.viewContainer);
    this.handleEditCompanyClick();
  },
  events: {
    'click [data-hook~=action-edit-company]': 'handleEditCompanyClick',
    'click [data-hook~=action-edit-participations]': 'handleEditParticipationsClick',
  },
  handleEditParticipationsClick: function () {
    var view = new ParticipationsView({ collection: this.model.participations });
    this.switcher.set(view);
    return false;
  },
  handleEditCompanyClick: function () {
    var view = new EditCompany({ model: this.model, parent: this });
    this.switcher.set(view);
    return false;
  }
});

var EditCompany = PageView.extend({
  template: templates.partials.companies.edit,
  subviews: {
    form: {
      // this is the css selector that will be the `el` in the
      // prepareView function.
      container: '[data-hook=company-form]',
      // this says we'll wait for `this.model` to be truthy
      waitFor: 'model',
      bindings:{
        'model.img': {
          type: 'attribute',
          hook: 'company-img',
          name: 'background'
        }
      },
      prepareView: function (el) {
        var self = this;
        var model = this.model;
        return new CompanyForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            data = self.model.changedAttributes(_.compactObject(data));
            if(!data) {
              return app.navigate('/companies/'+model.id);
            }
            self.model.save(data, {
              patch: true,
              wait: false,
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