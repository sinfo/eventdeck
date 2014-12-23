/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var SessionForm = require('client/js/forms/session');
var _ = require('client/js/helpers/underscore');


module.exports = PageView.extend({
  pageTitle: 'Edit session',
  template: templates.pages.sessions.edit,
  initialize: function (spec) {
    var self = this;
    app.sessions.getOrFetch(spec.id, {all: true}, function (err, model) {
      if (err) {
        return alert('couldnt find a model with id: ' + spec.id);
      }
      self.model = model;
    });
  },
  subviews: {
    form: {
      container: '[data-hook=session-form]',
      waitFor: 'model',
      bindings:{
        'model.img': {
          type: 'attribute',
          hook: 'session-img',
          name: 'background'
        }
      },
      prepareView: function (el) {
        var self = this;
        var model = this.model;
        return new SessionForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            data = self.model.changedAttributes(_.compactObject(data));
            if(!data) {
              return app.navigate('/sessions/'+model.id);
            }
            self.model.save(data, {
              patch: true,
              wait: false,
              success: function (model, response, options) {
                app.navigate('/sessions/'+model.id);
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