/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var MemberForm = require('client/js/forms/member');


module.exports = PageView.extend({
  pageTitle: 'edit person',
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
            model.save(data, {
              wait: true,
              success: function () {
                app.navigate('/members/'+model.id);
              }
            });
          }
        });
      }
    }
  }
});
