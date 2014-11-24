/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var populate = require('client/js/helpers/populate');
var MemberForm = require('client/js/forms/member');


module.exports = PageView.extend({
  pageTitle: 'Edit person',
  template: templates.pages.members.edit,
  initialize: function (spec) {
    var self = this;
    app.members.getOrFetch(spec.id, {all: true}, function (err, model) {
      if (err) {
        return alert('couldnt find a model with id: ' + spec.id);
      }
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
        var self = this;
        var model = this.model;
        return new MemberForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            data.roles = data.roles.map(function(r) {
              return {
                id: r
              };
            }) || [],

            populate(data, this.model, ['facebook.id', 'facebook.username', 'mails.main', 'mails.institutional', 'mails.dropbox', 'mails.google', 'mails.microsoft']);
            data = self.model.changedAttributes(data);
            model.save(data, {
              patch: true,
              wait: false,
              success: function (model, response, options) {
                app.navigate('/members/'+model.id);
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
