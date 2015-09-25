/*global app, alert*/
var log = require('bows')('speakers');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var SpeakerForm = require('client/js/forms/speaker');
var _ = require('client/js/helpers/underscore');


module.exports = PageView.extend({
  pageTitle: 'Edit speaker',
  template: templates.pages.speakers.edit,
  initialize: function (spec) {
    var self = this;
    app.speakers.getOrFetch(spec.id, function (err, model) {
      if (err) {
        return alert('couldnt find a model with id: ' + spec.id);
      }
      self.model = model;
    });
  },
  subviews: {
    form: {
      container: '[data-hook=speaker-form]',
      waitFor: 'model',
      bindings:{
        'model.img': {
          type: 'attribute',
          hook: 'speaker-img',
          name: 'background'
        }
      },
      prepareView: function (el) {
        var self = this;
        var model = this.model;
        return new SpeakerForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            data = self.model.changedAttributes(_.compactObject(data));
            if(!data) {
              return app.navigate('/speakers/'+model.id);
            }
            self.model.save(data, {
              patch: true,
              wait: false,
              success: function (model, response, options) {
                app.navigate('/speakers/'+model.id);
              },
              error: function (model, response, options) {
                log.error(response.statusCode +' '+ response.response);
              }
            });
          }
        });
      }
    }
  }
});