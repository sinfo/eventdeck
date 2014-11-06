/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var MemberForm = require('client/js/forms/member');


module.exports = PageView.extend({
  pageTitle: 'Edit person',
  template: templates.pages.members.edit,
  initialize: function (spec) {
    var self = this;
    app.members.getOrFetch(spec.id, {all: true}, function (err, model) {
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
        return new MemberForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            if(data['facebook.id'] || data['facebook.username']) {
              data.facebook = this.model.facebook || {};
              data.facebook.id = data['facebook.id'] || data.facebook.id;
              data.facebook.username = data['facebook.username'] || data.facebook.username;
              delete data['facebook.id'];
              delete data['facebook.username'];
            }
            if(data['mails.main'] || data['mails.institutional'] || data['mails.dropbox'] 
              || data['mails.google'] || data['mails.microsoft']) {
              data.mails = this.model.mails || {};
              data.mails.main = data['mails.main'] || data.mails.main;
              data.mails.institutional = data['mails.institutional'] || data.mails.institutional;
              data.mails.dropbox = data['mails.dropbox'] || data.mails.dropbox;
              data.mails.google = data['mails.google'] || data.mails.google;
              data.mails.microsoft = data['mails.microsoft'] || data.mails.microsoft;
              delete data['mails.main'];
              delete data['mails.institutional'];
              delete data['mails.dropbox'];
              delete data['mails.google'];
              delete data['mails.microsoft'];
            }

            model.save(data, {
              wait: true,
              success: function (model, response, options) {
                app.navigate('/members/'+model.id);
              },
              error: function (model, response, options) {
                console.log('error', response.statusCode, response.response)
              }
            });
          }
        });
      }
    }
  }
});
