/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var TopicForm = require('client/js/forms/topic');
var _ = require('client/js/helpers/underscore');
var async = require('async');


module.exports = PageView.extend({
  pageTitle: 'Edit topic',
  template: templates.pages.topics.edit,
  initialize: function (spec) {
    var self = this;

    async.parallel([
      function(cb) {
        if(app.members.length) {
          return cb();
        }
        app.members.fetch({ success: function () {
          cb();
        }});
      },
      function(cb) {
        if(app.tags.length) {
          return cb();
        }
        app.tags.fetch({ success: function () {
          cb();
        }});
      }
    ],
    function(err) {
      app.topics.getOrFetch(spec.id, {all: true}, function (err, model) {
        if (err) {
          return alert('couldnt find a model with id: ' + spec.id);
        }

        self.model = model;
      });
    });
  },
  subviews: {
    form: {
      container: '[data-hook=topic-form]',
      waitFor: 'model',
      prepareView: function (el) {
        var self = this;
        var model = this.model;
        return new TopicForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            data.poll = {
              kind: data['poll-kind'],
              options: data['poll-options'].map(function(o) { return { content: o }; })
            };

            delete data['poll-kind'];
            delete data['poll-options'];

            console.log('data', data);

            data = self.model.changedAttributes(_.compactObject(data));

            if(!data) {
              return app.navigate('/topics/'+model.id);
            }
            self.model.save(data, {
              patch: true,
              wait: false,
              success: function (model, response, options) {
                app.navigate('/topics/'+model.id);
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